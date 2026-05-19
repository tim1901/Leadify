const Anthropic = require('@anthropic-ai/sdk');

function extractJSON(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? JSON.parse(match[0]) : null;
}

exports.handler = async (event) => {
  try {
    const { companyName, research, contact, userProfile } = JSON.parse(event.body);
    
    if (!companyName || !research || !contact || !userProfile) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    // STEP 1: Extract pain points from research
    const painPointsPrompt = `From this research about ${companyName}, extract 2-3 specific, concrete operational pain points they likely face based on their business model:

"${research}"

Return as numbered list format, be specific to their industry/type.`;

    const painResponse = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: painPointsPrompt }]
    });

    const painPoints = painResponse.content[0].text;

    // STEP 2: Compose strategic email using the pattern
    const emailPrompt = `You are ${userProfile.fullName}, a ${userProfile.role} who specializes in: ${userProfile.services}.

You are writing to ${contact.name} (${contact.role}) at ${companyName}.

COMPANY CONTEXT:
${research}

IDENTIFIED PAIN POINTS:
${painPoints}

EMAIL PATTERN TO FOLLOW:

Subject: [Specific benefit for their company] + [Your expertise area]

Body (150-200 words):
1. **Opening**: Brief statement about helping companies like theirs with specific challenges
2. **Pain Point 1**: Name their first operational/security/efficiency challenge
3. **Pain Point 2**: Name their second challenge (what they struggle with)
4. **Your Solution**: How your services (${userProfile.services}) solve BOTH problems
5. **Proof Point**: Mention impact/results (% improvement, time saved, cost reduction)
6. **Soft CTA**: Ask for a brief call to discuss further
7. **Closing**: Professional but warm signature

TONE: Executive-level, strategic, solution-focused. Show you understand their specific business challenges. Avoid generic language.

Write the email now. Return as JSON: {"emailSubject":"","emailBody":""}`;

    const emailResponse = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: emailPrompt }]
    });

    const emailText = emailResponse.content[0].text;
    const email = extractJSON(emailText) || {
      emailSubject: `${userProfile.services} for ${companyName}`,
      emailBody: `Hi ${contact.name},\n\nI work with companies like ${companyName} to improve operational efficiency through ${userProfile.services}.\n\nBased on your company profile, I see opportunities to address key challenges around scalability and efficiency.\n\nWould you be open to a brief 15-minute call to discuss how we've helped similar organizations?\n\nBest regards,\n${userProfile.fullName}\n${userProfile.role}`
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        emailSubject: email.emailSubject,
        emailBody: email.emailBody,
        recipient: contact.name,
        recipientEmail: contact.email,
        recipientRole: contact.role,
        painPoints: painPoints
      })
    };

  } catch (error) {
    console.error('Error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
