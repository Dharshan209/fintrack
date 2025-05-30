import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    setIsDropdownOpen(false);
    // Add logout logic here
  };
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">≡</div>
            <span className="logo-text">FinTrack</span>
          </div>
        </div>
        
        <nav className="header-nav">
          <a href="/" className="nav-link active">Dashboard</a>
          <a href="/transactions" className="nav-link">Transactions</a>
          <a href="#" className="nav-link">Budgets</a>
          <a href="/reports" className="nav-link">Reports</a>
        </nav>
        
        <div className="header-right">
          <div className="notification-icon">
            <Bell size={20} />
          </div>
          <div className="user-dropdown">
            <div className="user-avatar-container" onClick={toggleDropdown}>
              <div className="user-avatar">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" alt="Sarah" />
              </div>
              <ChevronDown size={16} className={`dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" alt="Sarah" />
                    </div>
                    <div className="dropdown-user-details">
                      <span className="user-name">Sarah Johnson</span>
                      <span className="user-email">sarah@fintrack.com</span>
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-items">
                  <button className="dropdown-item" onClick={handleProfileClick}>
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="dropdown-item" onClick={handleSettingsClick}>
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogoutClick}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;