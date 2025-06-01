import React, { useEffect, useState } from 'react';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const name = localStorage.getItem("user_name");
  const mail = localStorage.getItem("user_mail");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    // Add your logout logic here
  };

  const fetchProfileUrl = async () => {
    try {
      const { data, error } = await supabase
        .schema('fintrack')
        .from('user_profiles')
        .select('avatar_url')
        .eq('id', user_id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchProfileUrl();
    }
  }, [user_id]);

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
          <a href="/telegram" className="nav-link">Telegram</a>
          <a href="/reports" className="nav-link">Reports</a>
        </nav>

        <div className="header-right">
          <div className="notification-icon">
            <Bell size={20} />
          </div>
          <div className="user-dropdown">
            <div className="user-avatar-container" onClick={toggleDropdown}>
              <div className="user-avatar">
                <img
                  src={avatarUrl || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                />
              </div>
              <ChevronDown size={16} className={`dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      <img
                        src={avatarUrl || "https://via.placeholder.com/40"}
                        alt="User Avatar"
                      />
                    </div>
                    <div className="dropdown-user-details">
                      <span className="user-name">{name}</span>
                      <span className="user-email">{mail}</span>
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
