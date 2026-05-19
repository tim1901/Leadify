import { createContext, useState, useContext, useEffect } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('userProfile');
      return saved ? JSON.parse(saved) : {
        fullName: '',
        role: '',
        location: '',
        linkedinUrl: '',
        services: '',
        targetMarket: ''
      };
    } catch (error) {
      console.error('Error loading profile:', error);
      return {
        fullName: '',
        role: '',
        location: '',
        linkedinUrl: '',
        services: '',
        targetMarket: ''
      };
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = (newProfile) => {
    try {
      setProfile(newProfile);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const isProfileComplete = () => {
    return (
      profile.fullName &&
      profile.role &&
      profile.location &&
      profile.services &&
      profile.targetMarket
    );
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isProfileComplete, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
