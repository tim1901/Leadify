exports.handler = async (event) => {
  try {
    const { companyName, companyWebsite } = JSON.parse(event.body);
    if (!companyName || !companyWebsite) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'PERPLEXITY_API_KEY not set' }) };
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{
          role: 'user',
          content: `Research ${companyName} (${companyWebsite}). Get: business type, what they do, 2-3 key pain points they likely face. Keep response SHORT (max 150 words). Focus on operational challenges.`
        }],
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity error: ${response.status}`);
    }

    const data = await response.json();
    const researchData = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        companyName,
        companyWebsite,
        research: researchData
      })
    };
  } catch (error) {
    console.error('Error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
