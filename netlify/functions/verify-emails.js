async function verifyEmail(email) {
  if (!email || email === 'unknown') return { email, verified: false };
  try {
    const key = process.env.QUICKEMAILVERIFICATION_API_KEY;
    if (!key) return { email, verified: false };
    const res = await fetch(`https://api.quickemailverification.com/v1/verify?email=${encodeURIComponent(email)}&apikey=${key}`);
    if (!res.ok) return { email, verified: false };
    const data = await res.json();
    return { email, verified: data.result === 'valid' };
  } catch (e) {
    return { email, verified: false };
  }
}

exports.handler = async (event) => {
  try {
    console.log('=== Verify Emails Function Start ===');
    
    const { team_members } = JSON.parse(event.body);
    
    if (!team_members || !Array.isArray(team_members)) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing team_members' }) 
      };
    }

    console.log(`Verifying ${team_members.length} emails...`);
    
    // STEP 3: Verify top 2 emails only
    const emailsToCheck = team_members.slice(0, 2).map(m => m.email).filter(e => e);
    const verified = await Promise.all(emailsToCheck.map(e => verifyEmail(e)));

    const contacts = team_members.map(m => ({
      name: m.name || 'Unknown',
      title: m.title || '',
      email: m.email || 'unknown',
      verified: verified.find(v => v.email === m.email)?.verified || false
    }));

    console.log('=== Verification Complete ===');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        contacts
      })
    };

  } catch (error) {
    console.error('Verify error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || 'Verification failed'
      })
    };
  }
};
