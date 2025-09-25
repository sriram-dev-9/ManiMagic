"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaGithub, FaSun, FaMoon, FaUser, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme, currentTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const isActiveRoute = (route: string) => {
    if (route === '/play') {
      return pathname === '/play' || pathname === '/playground';
    }
    if (route === '/community') {
      return pathname === '/community' || pathname?.startsWith('/project/') || pathname === '/upload';
    }
    return pathname === route;
  };

  const navStyle = {
    background: currentTheme.background,
    borderBottom: `1px solid ${currentTheme.border}`,
    position: 'fixed' as const,
    top: 0,
    width: '100%',
    zIndex: 50,
    height: '64px',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    height: '100%',
  };

  const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: currentTheme.text,
    transition: 'opacity 0.2s ease',
  };

  const desktopNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const getNavLinkStyle = (route: string) => ({
    color: isActiveRoute(route) ? currentTheme.active : currentTheme.textSecondary,
    background: isActiveRoute(route) ? currentTheme.activeBg : 'transparent',
    border: isActiveRoute(route) ? `1px solid ${currentTheme.activeBorder}` : '1px solid transparent',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
  });

  const themeToggleStyle = {
    color: currentTheme.textSecondary,
    background: 'transparent',
    border: `1px solid ${currentTheme.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const mobileButtonStyle = {
    color: currentTheme.text,
    background: 'transparent',
    border: `1px solid ${currentTheme.border}`,
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s ease',
  };

  const mobileNavStyle = {
    background: currentTheme.mobileBg,
    borderTop: `1px solid ${currentTheme.border}`,
    padding: '16px',
  };

  const getMobileLinkStyle = (route: string) => ({
    color: isActiveRoute(route) ? currentTheme.active : currentTheme.textSecondary,
    background: isActiveRoute(route) ? currentTheme.activeBg : 'transparent',
    border: isActiveRoute(route) ? `1px solid ${currentTheme.activeBorder}` : '1px solid transparent',
    display: 'block',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
  });

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={contentStyle}>
          {/* Logo */}
          <Link href="/" style={logoStyle}>
            <Image 
              src="/Group 27.svg" 
              alt="ManiMagic Logo" 
              width={32} 
              height={32}
              style={{ filter: 'brightness(1.2)' }}
            />
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: currentTheme.logoText,
            }}>ManiMagic</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={desktopNavStyle}>
              <Link 
                href="/play" 
                style={getNavLinkStyle('/play')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/play')) {
                    e.currentTarget.style.color = currentTheme.text;
                    e.currentTarget.style.background = currentTheme.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/play')) {
                    e.currentTarget.style.color = currentTheme.textSecondary;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Play
              </Link>
              <Link 
                href="/svg-to-animation" 
                style={getNavLinkStyle('/svg-to-animation')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/svg-to-animation')) {
                    e.currentTarget.style.color = currentTheme.text;
                    e.currentTarget.style.background = currentTheme.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/svg-to-animation')) {
                    e.currentTarget.style.color = currentTheme.textSecondary;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                SVG to Animation
              </Link>
              <Link 
                href="/community" 
                style={getNavLinkStyle('/community')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/community')) {
                    e.currentTarget.style.color = currentTheme.text;
                    e.currentTarget.style.background = currentTheme.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/community')) {
                    e.currentTarget.style.color = currentTheme.textSecondary;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Community
              </Link>
              <Link 
                href="/docs" 
                style={getNavLinkStyle('/docs')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/docs')) {
                    e.currentTarget.style.color = currentTheme.text;
                    e.currentTarget.style.background = currentTheme.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/docs')) {
                    e.currentTarget.style.color = currentTheme.textSecondary;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Docs
              </Link>
              <Link 
                href="/examples" 
                style={getNavLinkStyle('/examples')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/examples')) {
                    e.currentTarget.style.color = currentTheme.text;
                    e.currentTarget.style.background = currentTheme.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/examples')) {
                    e.currentTarget.style.color = currentTheme.textSecondary;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Examples
              </Link>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                style={themeToggleStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = currentTheme.hoverBg;
                  e.currentTarget.style.borderColor = currentTheme.active;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = currentTheme.border;
                }}
              >
                {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
              
              <a
                href="https://github.com/Jagan-Dev-9/ManiMagic"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: currentTheme.textSecondary,
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.active;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.textSecondary;
                }}
              >
                <FaGithub style={{ width: '20px', height: '20px' }} />
              </a>

              {/* Authentication UI */}
              {!loading && (
                <>
                  {user ? (
                    <div style={{ position: 'relative' }} data-user-menu>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: currentTheme.hoverBg,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: '8px',
                          color: currentTheme.text,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <FaUser size={14} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                        </span>
                      </button>
                      
                      {showUserMenu && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            background: currentTheme.background,
                            border: `1px solid ${currentTheme.border}`,
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            minWidth: '160px',
                            zIndex: 1000,
                          }}
                        >
                          <button
                            onClick={async () => {
                              await signOut();
                              setShowUserMenu(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '12px 16px',
                              background: 'transparent',
                              border: 'none',
                              color: currentTheme.textSecondary,
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              borderRadius: '8px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = currentTheme.hoverBg;
                              e.currentTarget.style.color = currentTheme.text;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = currentTheme.textSecondary;
                            }}
                          >
                            <FaSignOutAlt size={14} />
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        href="/login"
                        style={{
                          color: currentTheme.textSecondary,
                          textDecoration: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = currentTheme.text;
                          e.currentTarget.style.background = currentTheme.hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = currentTheme.textSecondary;
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        style={{
                          background: currentTheme.active,
                          color: 'white',
                          textDecoration: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                style={themeToggleStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = currentTheme.hoverBg;
                  e.currentTarget.style.borderColor = currentTheme.active;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = currentTheme.border;
                }}
              >
                {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={mobileButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = currentTheme.hoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {isMenuOpen ? 
                  <FaTimes style={{ width: '20px', height: '20px' }} /> : 
                  <FaBars style={{ width: '20px', height: '20px' }} />
                }
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && isMobile && (
          <div style={mobileNavStyle}>
            <Link
              href="/play"
              style={getMobileLinkStyle('/play')}
              onClick={() => setIsMenuOpen(false)}
            >
              Play
            </Link>
            <Link
              href="/svg-to-animation"
              style={getMobileLinkStyle('/svg-to-animation')}
              onClick={() => setIsMenuOpen(false)}
            >
              SVG to Animation
            </Link>
            <Link
              href="/docs"
              style={getMobileLinkStyle('/docs')}
              onClick={() => setIsMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/examples"
              style={getMobileLinkStyle('/examples')}
              onClick={() => setIsMenuOpen(false)}
            >
              Examples
            </Link>
            <a
              href="https://github.com/Jagan-Dev-9/ManiMagic"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...getMobileLinkStyle(''),
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px',
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaGithub size={16} />
              GitHub
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
