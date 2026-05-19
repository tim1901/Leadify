import { useProfile } from '../utils/profileContext.jsx';
import { useState } from 'react';
import './Settings.css';

export default function Settings() {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSave = () => {
    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.role.trim()) {
      setError('Role is required');
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }
    if (!formData.services.trim()) {
      setError('Services description is required');
      return;
    }
    if (!formData.targetMarket.trim()) {
      setError('Target market is required');
      return;
    }

    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-container">
      <h2>⚙️ Your Profile</h2>
      <p className="description">
        This information personalizes all research, pain point identification, and emails.
        Claude will tailor everything based on your services and target market.
      </p>

      <div className="form-group">
        <label>YOUR FULL NAME *</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="e.g., Timileyin Ajuwon"
        />
        <small>Used to sign off all emails</small>
      </div>

      <div className="form-group">
        <label>YOUR ROLE / TITLE *</label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="e.g., AI Operations Specialist"
        />
        <small>Shows in emails and app footer</small>
      </div>

      <div className="form-group">
        <label>YOUR LOCATION *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="e.g., Ibadan, Nigeria"
        />
        <small>Adds local context to outreach (especially for African market)</small>
      </div>

      <div className="form-group">
        <label>LINKEDIN PROFILE URL</label>
        <input
          type="text"
          value={formData.linkedinUrl}
          onChange={(e) => handleChange('linkedinUrl', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <small>Linked in emails for credibility and easy connection</small>
      </div>

      <div className="form-group">
        <label>YOUR SERVICES *</label>
        <textarea
          value={formData.services}
          onChange={(e) => handleChange('services', e.target.value)}
          placeholder="e.g., AI workflow automation, no-code tool implementation, operations optimization, process documentation"
          rows="4"
        />
        <small>
          Used to identify relevant pain points in prospect companies.
          Claude will only highlight problems you can solve.
        </small>
      </div>

      <div className="form-group">
        <label>YOUR TARGET MARKET *</label>
        <textarea
          value={formData.targetMarket}
          onChange={(e) => handleChange('targetMarket', e.target.value)}
          placeholder="e.g., Startups, SMEs, and growing businesses in Africa that need operations and automation help"
          rows="3"
        />
        <small>
          Helps Claude identify the best fit companies.
          Research will score companies based on how well they match this.
        </small>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="actions">
        <button onClick={handleSave} className="save-btn">
          💾 Save Profile
        </button>
        {saved && <span className="saved-msg">✅ Profile saved!</span>}
      </div>

      <div className="impact-info">
        <h4>📊 How Your Profile Affects the App:</h4>
        <ul>
          <li>
            <strong>🎯 Research:</strong> Pain points identified based on your services
          </li>
          <li>
            <strong>💌 Emails:</strong> Personalized with your name, location, and expertise
          </li>
          <li>
            <strong>📍 Fit Scoring:</strong> Companies ranked by how well they match your target market
          </li>
          <li>
            <strong>🌍 Localization:</strong> Your location mentioned in emails for market context
          </li>
          <li>
            <strong>🔗 Credibility:</strong> LinkedIn URL included to build trust
          </li>
          <li>
            <strong>💡 Pain Points:</strong> Highlighted pain points are ones YOUR services can solve
          </li>
        </ul>
      </div>

      <div className="profile-preview">
        <h4>📋 Profile Summary</h4>
        <div className="preview-card">
          <p><strong>Name:</strong> {formData.fullName || '(Not set)'}</p>
          <p><strong>Role:</strong> {formData.role || '(Not set)'}</p>
          <p><strong>Location:</strong> {formData.location || '(Not set)'}</p>
          <p><strong>Services:</strong> {formData.services || '(Not set)'}</p>
          <p><strong>Target Market:</strong> {formData.targetMarket || '(Not set)'}</p>
        </div>
      </div>
    </div>
  );
}
