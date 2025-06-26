import React, { useEffect, useState } from 'react';
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText
} from 'lucide-react';
// import './Header.css'; // Removed: CSS is now included in a <style> tag below.
import { useNavigate, useLocation } from 'react-router-dom';

// MOCK: In a real environment, you would import your configured Supabase client.
// This mock is included to allow the component to compile and demonstrate functionality.
const supabase = {
  auth: {
    signOut: () => new Promise(resolve => resolve({ error: null })),
  },
  schema: () => supabase,
  from: () => supabase,
  select: () => supabase,
  eq: () => supabase,
  single: () => new Promise(resolve => resolve({ 
    data: { avatar_url: 'https://via.placeholder.com/40' }, 
    error: null 
  })),
};


const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for user session from local storage
  const user_id = localStorage.getItem("user_id");
  const name = localStorage.getItem("user_name");
  const mail = localStorage.getItem("user_mail");
  const isLoggedIn = !!user_id; // Will be true if user_id exists, false otherwise

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/telegram', label: 'Telegram', icon: MessageSquare },
    { path: '/reports', label: 'Reports', icon: FileText }
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeMobileMenu();
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
    closeMobileMenu();
  };

  const handleSettingsClick = () => {
    // Navigate to a settings page if you have one
    setIsDropdownOpen(false);
    closeMobileMenu();
  };


  const handleLogoutClick = async () => {
    setIsDropdownOpen(false);
    closeMobileMenu();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
    
    // Clear all user-related data from local storage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_mail');

    // Navigate to login and force a reload to ensure the header updates
    navigate('/');
    window.location.reload();
  };
  
  const fetchProfileUrl = async () => {
    if (!user_id) return;
    try {
      const { data, error } = await supabase
        .schema('fintrack')
        .from('user_profiles')
        .select('avatar_url')
        .eq('id', user_id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else if (data) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfileUrl();
    }
  }, [isLoggedIn]);

  return (
    <>
      {/* Styles that would normally be in Header.css */}
      <style>{`
        .header {
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 1.5rem;
          height: 4rem;
          display: flex;
          align-items: center;
        }
        .header-container {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 1.25rem;
          cursor: pointer;
        }
        .header-nav {
          display: none; /* Hidden on mobile by default */
        }
        @media (min-width: 768px) {
          .header-nav {
            display: flex;
            gap: 1.5rem;
          }
        }
        .nav-link {
          color: #4b5563;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #111827;
        }
        .nav-link.active {
          color: #000000;
          border-bottom: 2px solid #000000;
        }
        .user-dropdown {
          position: relative;
        }
        .user-avatar-container {
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .user-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          width: 220px;
          z-index: 50;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: #f3f4f6;
        }
        .login-button-header {
          background-color: #111827;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }
        .mobile-menu-button {
            display: block;
        }
        @media (min-width: 768px) {
            .mobile-menu-button {
                display: none;
            }
        }
      `}</style>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <button
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="logo" onClick={() => navigate('/dashboard')}>
              <div className="logo-icon">≡</div>
              <span className="logo-text">FinTrack</span>
            </div>
          </div>

          <nav className="header-nav">
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.path); }}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-right">
            <div className="notification-icon">
              <Bell size={20} />
            </div>

            {isLoggedIn ? (
              // If LOGGED IN, show user profile dropdown
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
                          <span className="user-name">{name || 'User'}</span>
                          <span className="user-email">{mail || 'No email'}</span>
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
            ) : (
              // If NOT LOGGED IN, show Login button
              <button className="login-button-header" onClick={() => navigate('/')}>
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Menu (also conditionally renders based on login state) */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu} />
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
         <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            <div className="mobile-nav-logo-icon">≡</div>
            <span>FinTrack</span>
          </div>
          <button className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <div className="mobile-nav-links">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {isLoggedIn ? (
            <div className="mobile-nav-user-section">
                <div className="mobile-nav-user-info">
                    <div className="mobile-nav-avatar">
                        <img src={avatarUrl || "https://via.placeholder.com/40"} alt="User Avatar" />
                    </div>
                    <div className="mobile-nav-user-details">
                        <span className="mobile-nav-user-name">{name}</span>
                        <span className="mobile-nav-user-email">{mail}</span>
                    </div>
                </div>
                <div className="mobile-nav-actions">
                    <button className="mobile-nav-action" onClick={handleProfileClick}><User size={14} /><span>Profile</span></button>
                    <button className="mobile-nav-action" onClick={handleSettingsClick}><Settings size={14} /><span>Settings</span></button>
                    <button className="mobile-nav-action logout" onClick={handleLogoutClick}><LogOut size={14} /><span>Logout</span></button>
                </div>
            </div>
        ) : (
             <div className="mobile-nav-login-section">
                <button className="login-button-header" onClick={() => handleNavClick('/')}>
                    Login
                </button>
            </div>
        )}
      </div>
    </>
  );
};

export default Header;
