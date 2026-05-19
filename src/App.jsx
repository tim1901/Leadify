import { useState } from 'react';
import { ProfileProvider } from './utils/profileContext.jsx';
import Agent from './components/Agent.jsx';
import Batch from './components/Batch.jsx';
import Contacts from './components/Contacts.jsx';
import Templates from './components/Templates.jsx';
import Tracker from './components/Tracker.jsx';
import Analytics from './components/Analytics.jsx';
import Settings from './components/Settings.jsx';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('agent');

  const tabs = [
    { id: 'agent', label: '⚡ Agent', icon: '⚡' },
    { id: 'batch', label: '⚡⚡ Batch', icon: '⚡⚡' },
    { id: 'contacts', label: '👤 Contacts', icon: '👤' },
    { id: 'templates', label: '📋 Templates', icon: '📋' },
    { id: 'tracker', label: '📊 Tracker', icon: '📊' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'agent':
        return <Agent />;
      case 'batch':
        return <Batch />;
      case 'contacts':
        return <Contacts />;
      case 'templates':
        return <Templates />;
      case 'tracker':
        return <Tracker />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Agent />;
    }
  };

  return (
    <ProfileProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🎯</span>
              <h1>Leadify</h1>
              <span className="version">v1.0 · AI Research</span>
            </div>
          </div>
        </header>

        <nav className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              data-tab={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="app-content">
          {renderComponent()}
        </main>
      </div>
    </ProfileProvider>
  );
}
