/**
 * Frontend API Client
 * Location: src/utils/apiClient.js
 * 
 * Handles all backend function calls for Outreach OS
 * Includes research, email generation, contact finding, and verification
 */

class APIClient {
  constructor() {
    this.baseURL = '/.netlify/functions';
  }

  /**
   * Generic call method for all API endpoints
   */
  async call(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call to ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Research a company with user profile context
   * Identifies pain points aligned to user's services
   */
  async researchCompany(companyName, userProfile) {
    return this.call('/research-enhanced', {
      companyName,
      userProfile
    });
  }

  /**
   * Find and verify decision maker emails
   * Uses Claude to guess emails, QEV to verify
   */
  async findDecisionMakerEmails(companyName, role, userProfile) {
    return this.call('/find-decision-maker-emails', {
      companyName,
      role,
      userProfile
    });
  }

  /**
   * Generate personalized emails for a specific person
   * Creates 3 variants: Formal, Casual, Data-driven
   */
  async generateDecisionMakerEmail(companyName, personName, role, research, userProfile) {
    return this.call('/business-developer-agent', {
      companyName,
      personName,
      role,
      research,
      userProfile
    });
  }

  /**
   * Save email to tracker (future: Airtable)
   */
  async saveEmailToTracker(emailData) {
    return this.call('/tracker', emailData);
  }

  /**
   * Get campaign analytics (future)
   */
  async getAnalytics(period = '30days') {
    return this.call('/analytics', { period });
  }

  /**
   * Legacy method for backward compatibility
   */
  async callClaude(prompt, mode = 'research') {
    try {
      const response = await fetch(`${this.baseURL}/claude-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, mode })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      const data = await response.json();

      return {
        success: true,
        message: data.message,
        usage: data.usage
      };

    } catch (error) {
      console.error('API Client error:', error);
      return {
        success: false,
        error: error.message,
        message: null
      };
    }
  }
}

// Export singleton instance
export default new APIClient();
