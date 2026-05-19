import { useProfile } from '../utils/profileContext.jsx';
import { useState } from 'react';
import './Agent.css';

export default function Agent() {
  const { profile, isProfileComplete } = useProfile();
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [research, setResearch] = useState(null);
  const [emails, setEmails] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState(null);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('search');

  if (!isProfileComplete()) {
    return (
      <div className="setup-prompt">
        <div className="prompt-icon">⚙️</div>
        <h3>Complete Your Profile First</h3>
        <p>Set up your name, services, and target market in Settings.</p>
        <button 
          onClick={() => document.querySelector('[data-tab="settings"]')?.click()}
          className="settings-link-btn"
        >
          📋 Go to Settings
        </button>
      </div>
    );
  }

  const handleWebSearch = async (e) => {
    e.preventDefault();
    if (!company.trim() || !website.trim()) {
      setError('Please fill in all fields');
      return;
    }

    let urlToUse = website.trim();
    if (!urlToUse.startsWith('http://') && !urlToUse.startsWith('https://')) {
      urlToUse = 'https://' + urlToUse;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/.netlify/functions/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: company, companyWebsite: urlToUse })
      });

      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();

      setResearch(data.research);
      setStage('researched');
      
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFindEmails = async () => {
    setLoading(true);
    setError('');

    try {
      let urlToUse = website.trim();
      if (!urlToUse.startsWith('http://') && !urlToUse.startsWith('https://')) {
        urlToUse = 'https://' + urlToUse;
      }

      const res = await fetch('/.netlify/functions/find-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyWebsite: urlToUse })
      });

      if (!res.ok) throw new Error(`Find emails failed (${res.status})`);
      const data = await res.json();

      setEmails(data.emails || []);
      setStage('emails');
      
    } catch (err) {
      setError(err.message || 'Failed to find emails');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (contact) => {
    setSelectedEmail(contact);
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/.netlify/functions/verify-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_members: [contact] })
      });

      if (!res.ok) throw new Error(`Verify failed (${res.status})`);
      const data = await res.json();

      setVerifiedEmail(data.contacts[0]);
      setStage('verified');
      
    } catch (err) {
      setError(err.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleComposeEmail = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/.netlify/functions/compose-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company,
          research: research,
          contact: verifiedEmail,
          userProfile: profile
        })
      });

      if (!res.ok) throw new Error(`Compose failed (${res.status})`);
      const data = await res.json();

      setEmail(data);
      setStage('email');
      
    } catch (err) {
      setError(err.message || 'Failed to compose email');
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = (body) => {
    navigator.clipboard.writeText(body);
    alert('✅ Email copied!');
  };

  const handleReset = () => {
    setCompany('');
    setWebsite('');
    setResearch(null);
    setEmails(null);
    setSelectedEmail(null);
    setVerifiedEmail(null);
    setEmail(null);
    setError('');
    setStage('search');
  };

  return (
    <div className="agent-container">
      <div className="agent-header">
        <h2>🎯 Leadify</h2>
        <p>AI Research Agent for {profile.fullName}</p>
      </div>

      {/* STEP 1: Search */}
      {stage === 'search' && (
        <div className="step-card">
          <div className="form-section">
            <h3>🔍 Step 1: Research Company</h3>
            <p className="step-description">Enter company details</p>
          </div>
          
          <form onSubmit={handleWebSearch} className="search-form">
            <div className="form-input">
              <input
                type="text"
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="form-input">
              <input
                type="text"
                placeholder="Website (e.g., paystack.com)"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '⏳ Researching...' : '🔍 Search Company'}
            </button>
            {error && <div className="error-msg">{error}</div>}
          </form>
        </div>
      )}

      {/* STEP 2: Show research */}
      {stage === 'researched' && research && (
        <div className="step-card">
          <div className="step-success">
            <h3>✅ Step 1 Complete: Research Done</h3>
            <p>{company}</p>
          </div>

          <div className="research-box">
            <h4>📋 Research Findings</h4>
            <p>{research}</p>
          </div>

          <div className="button-group">
            <button onClick={handleFindEmails} disabled={loading} className="btn-primary">
              {loading ? '⏳ Finding...' : '👥 Step 2: Find Emails'}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              ← Start Over
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {/* STEP 3: Show emails or no results */}
      {stage === 'emails' && (
        <div className="step-card">
          {emails && emails.length > 0 ? (
            <>
              <div className="step-success">
                <h3>✅ Step 2 Complete: Emails Found</h3>
                <p>{emails.length} contact(s) discovered</p>
              </div>

              <div className="executives-list">
                {emails.map((contact, i) => (
                  <div key={i} className="executive-item">
                    <div className="exec-info">
                      <h4>{contact.name}</h4>
                      <p className="exec-title">{contact.role}</p>
                      <p className="exec-email">{contact.email}</p>
                    </div>
                    <button 
                      onClick={() => handleVerifyEmail(contact)}
                      disabled={loading}
                      className="btn-primary-small"
                    >
                      {loading ? '⏳' : '✅'} Verify
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <h3>⚠️ No Emails Found</h3>
              <p>The website doesn't have publicly listed email addresses, or they couldn't be extracted.</p>
              <p className="subtext">This could mean:</p>
              <ul>
                <li>Contact info is behind a form/login</li>
                <li>Emails aren't displayed on public pages</li>
                <li>Website uses contact forms instead of email addresses</li>
              </ul>
            </div>
          )}

          <div className="button-group">
            <button onClick={handleReset} className="btn-secondary">
              ← Start Over
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {/* STEP 4: Show verified email */}
      {stage === 'verified' && verifiedEmail && (
        <div className="step-card">
          <div className="step-success">
            <h3>✅ Step 3 Complete: Email Verified</h3>
            <p>{verifiedEmail.name}</p>
          </div>

          <div className="verified-box">
            <div className="verified-row">
              <span className="label">Name:</span>
              <span className="value">{verifiedEmail.name}</span>
            </div>
            <div className="verified-row">
              <span className="label">Title:</span>
              <span className="value">{verifiedEmail.title}</span>
            </div>
            <div className="verified-row">
              <span className="label">Email:</span>
              <span className="value email">{verifiedEmail.email}</span>
            </div>
            <div className="verified-row">
              <span className="label">Status:</span>
              <span className="value">
                {verifiedEmail.verified ? '✅ Valid' : '⚠️ Unverified'}
              </span>
            </div>
          </div>

          <div className="button-group">
            <button 
              onClick={handleComposeEmail}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '⏳ Composing...' : '✍️ Step 4: Compose Email'}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              ← Start Over
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {/* STEP 5: Show composed email */}
      {stage === 'email' && email && (
        <div className="step-card">
          <div className="step-success">
            <h3>✅ Step 4 Complete: Email Ready</h3>
            <p>For {email.recipient}</p>
          </div>

          <div className="email-box">
            <div className="email-to">
              <strong>To:</strong> {email.recipientEmail}
            </div>
            <div className="email-subject">
              <strong>Subject:</strong> {email.emailSubject}
            </div>
            <div className="email-body">
              <strong>Message:</strong>
              <p>{email.emailBody}</p>
            </div>
          </div>

          <div className="button-group">
            <button 
              onClick={() => copyEmail(`Subject: ${email.emailSubject}\n\n${email.emailBody}`)}
              className="btn-primary"
            >
              📋 Copy Email
            </button>
            <button disabled className="btn-disabled">
              📤 Send (Coming Soon)
            </button>
            <button onClick={handleReset} className="btn-secondary">
              ← New Research
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="step-card loading-card">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}
