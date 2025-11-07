import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import SuccessMessage from './components/SuccessMessage';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentUser, setCurrentUser] = useLocalStorage('learnpath_user', null);
  const [userProgress, setUserProgress] = useLocalStorage('learnpath_progress', {});
  const [currentSkill, setCurrentSkill] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [successMessage, setSuccessMessage] = useState('');

  const showSection = (sectionId) => {
    setCurrentSection(sectionId);
  };

  const showRoadmap = (skillKey) => {
    setCurrentSkill(skillKey);
    setCurrentSection('roadmap');
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setShowAuthModal(false);
    showSuccess('Welcome back! Ready to learn? 🎉');
  };

  const handleSignup = (userData) => {
    setCurrentUser(userData);
    setShowAuthModal(false);
    showSuccess('Account created! Start your journey! 🚀');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showSuccess('See you next time! 👋');
  };

  const openAuthModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const updateProgress = (skillKey, stepIndex, itemIndex, completed) => {
    setUserProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress[skillKey]) newProgress[skillKey] = { steps: {} };
      if (!newProgress[skillKey].steps[stepIndex]) newProgress[skillKey].steps[stepIndex] = { checklist: {} };
      newProgress[skillKey].steps[stepIndex].checklist[itemIndex] = completed;
      return newProgress;
    });
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const calculateSkillProgress = (skillKey) => {
    const skill = userProgress[skillKey];
    if (!skill) return 0;

    let totalItems = 0;
    let completedItems = 0;

    Object.values(skill.steps || {}).forEach(step => {
      const stepItems = Object.values(step.checklist || {});
      totalItems += stepItems.length;
      completedItems += stepItems.filter(Boolean).length;
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onShowSection={showSection} />;
      case 'skills':
        return (
          <Skills 
            onShowSection={showSection} 
            onShowRoadmap={showRoadmap} 
            userProgress={userProgress}
            calculateSkillProgress={calculateSkillProgress}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            onShowSection={showSection} 
            userProgress={userProgress} 
            currentUser={currentUser}
            calculateSkillProgress={calculateSkillProgress}
            onShowRoadmap={showRoadmap}
          />
        );
      case 'roadmap':
        return currentSkill ? (
          <Roadmap 
            skillKey={currentSkill} 
            onShowSection={showSection} 
            userProgress={userProgress}
            onUpdateProgress={updateProgress}
            currentUser={currentUser}
            onShowSuccess={showSuccess}
            calculateSkillProgress={calculateSkillProgress}
          />
        ) : (
          <div className="container">Loading...</div>
        );
      default:
        return <Home onShowSection={showSection} />;
    }
  };

  return (
    <div className="App">
      <Header 
        currentUser={currentUser}
        onLoginClick={() => openAuthModal('login')}
        onSignupClick={() => openAuthModal('signup')}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        {renderSection()}
      </main>

      {showAuthModal && (
        <AuthModal
          type={authType}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}

      <SuccessMessage message={successMessage} />
    </div>
  );
}

export default App;