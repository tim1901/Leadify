# OutreachOS - AI-Powered B2B Sales Intelligence

Version 1.0 | AI-Powered with Claude

## Overview

OutreachOS is a comprehensive AI-powered B2B sales intelligence and personalized outreach platform. It combines:

- **Profile-driven personalization**: Customize research and emails based on your services and target market
- **Deep company research**: Analyzes companies across 5 dimensions (overview, hiring, trends, pain points, executives)
- **Email finding & verification**: Uses Claude AI + QuickEmailVerification to find and validate real email addresses
- **Personalized email generation**: Creates 3 variants (Formal, Casual, Data-driven) tailored to each person
- **Responsive UI**: Dark theme, mobile-friendly, real-time updates

## Stack

**Frontend:**
- React 18 with Hooks
- Vite for fast development
- CSS3 (Grid, Flexbox)
- Context API for state management

**Backend:**
- Netlify Functions (serverless)
- Anthropic Claude API
- QuickEmailVerification API

**APIs:**
- Claude 3.5 Sonnet for research and email generation
- QuickEmailVerification for email verification
- Netlify Functions for backend

## Features

✅ **Profile System**: Store your name, role, location, services, target market, LinkedIn
✅ **Company Research**: Get fit score, overview, hiring signals, trends, pain points, executives
✅ **Email Finding**: Claude finds likely emails → QEV verifies → Shows verified only
✅ **Email Generation**: 3 personalized variants (Formal, Casual, Data-driven)
✅ **Fit Scoring**: 0-100% match to your target market
✅ **Responsive Design**: Works on desktop, tablet, mobile

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- GitHub account
- Netlify account (connected to GitHub)

### 1. Setup
```bash
npm install
```

### 2. Environment Variables
Get API keys:
- Claude API: https://console.anthropic.com
- QuickEmailVerification: https://quickemailverification.com/register

Create `.env.local`:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_QUICKEMAILVERIFICATION_API_KEY=your_key_here
```

### 3. Development
```bash
npm run dev
```
Open http://localhost:5173

### 4. Deployment
```bash
git push origin main
```
Netlify auto-deploys. Add these environment variables in Netlify settings:
- `ANTHROPIC_API_KEY`
- `QUICKEMAILVERIFICATION_API_KEY`

## How It Works

### Settings Tab
Fill in your profile:
- Name, role, location, LinkedIn
- Services you offer
- Target market

### Agent Tab
1. **Search**: Enter company name
2. **Research**: Claude researches with your profile context
3. **Results**: See fit score, pain points, executives
4. **Find Emails**: Click executive → Claude finds + QEV verifies emails
5. **Generate Emails**: Click person → Get 3 personalized variants
6. **Copy**: Copy email ready to send

## File Structure

```
outreach-sys/
├── src/
│   ├── components/
│   │   ├── Agent.jsx           # Main search & research interface
│   │   ├── Agent.css
│   │   ├── Settings.jsx        # User profile form
│   │   └── Settings.css
│   ├── utils/
│   │   ├── profileContext.js   # React context for profile
│   │   └── apiClient.js        # API methods
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── style.css               # Global styles
├── netlify/
│   └── functions/
│       ├── research-enhanced.js                # Company research
│       ├── find-decision-maker-emails.js       # Email finding
│       └── business-developer-agent.js         # Email generation
├── public/                     # Static files
├── index.html
├── package.json
├── netlify.toml               # Netlify config
├── vite.config.js             # Vite config
└── .env.example
```

## Costs

- **Claude research**: ~$0.0006 per search
- **Email verification**: FREE (100/day with QuickEmailVerification)
- **Total**: ~$0.002 per company research

Monthly (100 companies): ~$0.20

## Documentation

See the docs folder for:
- `QUICK_START.txt` - Visual overview
- `BUILD_COMPLETE.txt` - Detailed breakdown
- `DEPLOYMENT_GUIDE.txt` - Step-by-step deployment
- `PROFILE_DRIVEN_PERSONALIZATION.txt` - How profile system works
- `CLAUDE_QEV_IMPLEMENTATION.txt` - Email finding architecture

## Roadmap (Phase 2+)

- [ ] Gmail API integration (send emails directly)
- [ ] Airtable tracking (store sent emails)
- [ ] Campaign analytics dashboard
- [ ] Batch CSV processing
- [ ] Email templates library
- [ ] LinkedIn API integration (find real names)
- [ ] Company org chart visualization

## Support

For issues, check:
1. Netlify Function logs: app.netlify.com → Functions
2. Browser console: F12 → Console
3. Documentation files (especially DEPLOYMENT_GUIDE.txt)

## License

MIT

## Author

Built with ❤️ for B2B sales professionals

---

**Ready to get started?**
1. Follow "Quick Start" above
2. Read the documentation
3. Deploy to Netlify
4. Start researching companies!

Happy outreaching! 🚀
