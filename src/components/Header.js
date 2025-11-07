import React from 'react';

const Header = ({ currentUser, onLoginClick, onSignupClick, onLogout }) => {
  return (
    <header className="header">
      <nav className="nav container">
        <div className="logo">LearnPath</div>
        <div className="nav-buttons">
          {currentUser ? (
            <div className="user-info logged-in">
              <div className="user-avatar">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="welcome-text">Welcome, {currentUser.username}!</span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn btn-outline" onClick={onLoginClick}>
                Login
              </button>
              <button className="btn btn-primary" onClick={onSignupClick}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;