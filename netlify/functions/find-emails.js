exports.handler = async (event) => {
  console.log('[find-emails] FUNCTION CALLED');
  
  try {
    const { companyWebsite } = JSON.parse(event.body);
    if (!companyWebsite) {
      console.error('[find-emails] Missing companyWebsite');
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing companyWebsite' }) };
    }

    const apiKey = process.env.APIFY_API_KEY;
    if (!apiKey) {
      console.error('[find-emails] APIFY_API_KEY not set');
      return { statusCode: 500, body: JSON.stringify({ error: 'APIFY_API_KEY not set' }) };
    }

    console.log(`[find-emails] Searching: ${companyWebsite}`);

    // Run Contact Info Finder
    const actorId = 'supreme_coder~contact-info-finder';
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}&waitForFinish=60`;

    const runResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [{ url: companyWebsite }],
        maxResults: 3
      }),
      timeout: 65000
    });

    console.log(`[find-emails] Apify response: ${runResponse.status}`);

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error(`[find-emails] Apify error: ${runResponse.status} - ${errorText}`);
      return { statusCode: 200, body: JSON.stringify({ success: true, emails: [] }) };
    }

    const runData = await runResponse.json();
    console.log(`[find-emails] Run status: ${runData.data?.status}`);

    const datasetId = runData.data?.defaultDatasetId;
    if (!datasetId) {
      console.log('[find-emails] No datasetId');
      return { statusCode: 200, body: JSON.stringify({ success: true, emails: [] }) };
    }

    console.log(`[find-emails] Dataset ID: ${datasetId}`);

    // Get dataset items
    const itemsResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}`,
      { method: 'GET' }
    );

    if (!itemsResponse.ok) {
      console.error(`[find-emails] Get items failed: ${itemsResponse.status}`);
      return { statusCode: 200, body: JSON.stringify({ success: true, emails: [] }) };
    }

    const itemsData = await itemsResponse.json();
    const allItems = Array.isArray(itemsData) ? itemsData : itemsData.data || [];
    console.log(`[find-emails] Total items: ${allItems.length}`);

    if (allItems.length > 0) {
      console.log('[find-emails] ===== FIRST ITEM STRUCTURE =====');
      console.log('[find-emails] Keys:', Object.keys(allItems[0]));
      console.log('[find-emails] Full item:', JSON.stringify(allItems[0], null, 2).substring(0, 800));
      console.log('[find-emails] ===== END FIRST ITEM =====');
    }

    // Extract emails - Contact Info Finder actual field names:
    // fullName, emailAddress, jobTitle
    const emails = allItems
      .map((item, idx) => {
        console.log(`[find-emails] Extracting item ${idx}:`, {
          fullName: item.fullName,
          emailAddress: item.emailAddress,
          jobTitle: item.jobTitle
        });
        
        return {
          name: item.fullName || item.personFullName || item.name || 'Unknown',
          email: item.emailAddress || item.personEmail || item.email || '',
          role: item.jobTitle || item.personTitle || item.title || item.position || 'Unknown'
        };
      })
      .filter(e => {
        const hasValidEmail = e.email && e.email.trim().length > 0 && e.email.includes('@');
        console.log(`[find-emails] Filter check: email="${e.email}" valid=${hasValidEmail}`);
        return hasValidEmail;
      })
      .slice(0, 3);

    console.log(`[find-emails] ✅ Found ${emails.length} valid emails`);
    emails.forEach((e, i) => {
      console.log(`[find-emails]   ${i+1}. ${e.name} (${e.role}) - ${e.email}`);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        emails: emails
      })
    };

  } catch (error) {
    console.error('[find-emails] ❌ ERROR:', error.message);
    console.error('[find-emails] Stack:', error.stack);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, emails: [] })
    };
  }
};
