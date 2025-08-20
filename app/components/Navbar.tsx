"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isActiveRoute = (route: string) => {
    if (route === '/play') {
      return pathname === '/play' || pathname === '/playground';
    }
    return pathname === route;
  };

  const navStyle = {
    background: '#212129',
    borderBottom: '1px solid #4c5265',
    position: 'fixed' as const,
    top: 0,
    width: '100%',
    zIndex: 50,
    height: '64px',
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
    color: '#f8fafc',
    transition: 'opacity 0.2s ease',
  };

  const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const desktopNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const getNavLinkStyle = (route: string) => ({
    color: isActiveRoute(route) ? '#60a5fa' : '#94a3b8',
    background: isActiveRoute(route) ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
    border: isActiveRoute(route) ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
  });

  const mobileButtonStyle = {
    color: '#f8fafc',
    background: 'transparent',
    border: '1px solid #4c5265',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '8px',
    transition: 'all 0.2s ease',
  };

  const mobileNavStyle = {
    background: '#323949',
    borderTop: '1px solid #4c5265',
    padding: '16px',
  };

  const getMobileLinkStyle = (route: string) => ({
    color: isActiveRoute(route) ? '#60a5fa' : '#94a3b8',
    background: isActiveRoute(route) ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
    border: isActiveRoute(route) ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
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
              color: 'white',
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
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/play')) {
                    e.currentTarget.style.color = '#94a3b8';
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
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/svg-to-animation')) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                SVG to Animation
              </Link>
              <Link 
                href="/docs" 
                style={getNavLinkStyle('/docs')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/docs')) {
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/docs')) {
                    e.currentTarget.style.color = '#94a3b8';
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
                    e.currentTarget.style.color = '#f8fafc';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/examples')) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                Examples
              </Link>
              <a
                href="https://github.com/Jagan-Dev-9/ManiMagic"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#94a3b8',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <FaGithub style={{ width: '20px', height: '20px' }} />
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={mobileButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
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
              style={getMobileLinkStyle('')}
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
