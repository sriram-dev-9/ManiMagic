"use client";
import React from "react";
import Link from "next/link";
import { FaPlay, FaCode, FaImage, FaGithub, FaArrowRight, FaUpload, FaDownload, FaPalette } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";

export default function Homepage() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#212129' : '#ece6e2',
    surface: isDark ? '#323949' : '#ffffff',
    surfaceSecondary: isDark ? '#3d3e51' : '#f8f9fa',
    text: isDark ? '#ffffff' : '#343434',
    textSecondary: isDark ? '#94a3b8' : '#6c757d',
    textMuted: isDark ? '#e2e8f0' : '#6c757d',
    primary: '#454866',
    secondary: '#81b29a',
    accent: '#e07a5f',
    border: isDark ? '#4c5265' : '#dee2e6',
    success: isDark ? '#10b981' : '#28a745'
  };

  const features = [
    {
      icon: <FaCode style={{ width: '32px', height: '32px' }} />,
      title: "Interactive Playground",
      description: "Write and test Manim code with real-time preview. Built-in templates and examples to get you started quickly."
    },
    {
      icon: <FaUpload style={{ width: '32px', height: '32px' }} />,
      title: "SVG to Animation",
      description: "Transform your SVG graphics into stunning animations. Simply upload your SVG and watch it come to life."
    },
    {
      icon: <FaDownload style={{ width: '32px', height: '32px' }} />,
      title: "Export Anywhere",
      description: "Download your animations as high-quality videos ready for presentations, social media, or education."
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      paddingTop: '64px',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: '24px',
          transition: 'color 0.3s ease'
        }}>
          ManiMagic
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: colors.textSecondary,
          marginBottom: '48px',
          maxWidth: '800px',
          margin: '0 auto 48px auto',
          transition: 'color 0.3s ease',
          lineHeight: '1.6'
        }}>
          Create stunning mathematical animations with ease. 
          Build, preview, and export beautiful Manim animations right in your browser.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '120px'
        }}>
          <Link href="/play" style={{
            background: colors.accent,
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem'
          }}>
            <FaPlay style={{ width: '20px', height: '20px', color: 'white' }} />
            Start Creating
            <FaArrowRight style={{ width: '16px', height: '16px', color: 'white' }} />
          </Link>
          
          <Link href="/svg-to-animation" style={{
            background: colors.secondary,
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem'
          }}>
            <FaImage style={{ width: '20px', height: '20px' }} />
            SVG to Animation
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        background: colors.surface,
        padding: '100px 20px',
        transition: 'background-color 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: '16px',
            transition: 'color 0.3s ease'
          }}>
            Features
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: '80px',
            maxWidth: '600px',
            margin: '0 auto 80px auto',
            transition: 'color 0.3s ease'
          }}>
            Everything you need to create professional mathematical animations
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: colors.surfaceSecondary,
                padding: '32px',
                borderRadius: '16px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                border: `1px solid ${colors.border}`,
                boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  color: colors.primary,
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: '16px',
                  transition: 'color 0.3s ease'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: colors.textSecondary,
                  lineHeight: '1.6',
                  transition: 'color 0.3s ease'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: colors.background,
        padding: '100px 20px',
        textAlign: 'center',
        transition: 'background-color 0.3s ease'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: '24px',
            transition: 'color 0.3s ease'
          }}>
            Ready to Create Amazing Animations?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: colors.textSecondary,
            marginBottom: '48px',
            transition: 'color 0.3s ease',
            lineHeight: '1.6'
          }}>
            Join thousands of educators, students, and creators who use ManiMagic to bring mathematics to life.
          </p>
          <Link href="/play" style={{
            background: colors.accent,
            color: 'white',
            padding: '20px 40px',
            borderRadius: '12px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            fontSize: '1.2rem'
          }}>
            <FaPlay style={{ width: '24px', height: '24px' }} />
            Get Started Now
            <FaArrowRight style={{ width: '20px', height: '20px' }} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        padding: '60px 20px 40px',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: colors.text,
                marginBottom: '16px',
                transition: 'color 0.3s ease'
              }}>
                ManiMagic
              </h3>
              <p style={{
                color: colors.textSecondary,
                lineHeight: '1.6',
                transition: 'color 0.3s ease'
              }}>
                Create beautiful mathematical animations with the power of Manim, 
                right in your browser. No installation required.
              </p>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: colors.text,
                marginBottom: '16px',
                transition: 'color 0.3s ease'
              }}>
                Tools
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/play" style={{
                  color: colors.textSecondary,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '0.95rem'
                }}>
                  Playground
                </Link>
                <Link href="/svg-to-animation" style={{
                  color: colors.textSecondary,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '0.95rem'
                }}>
                  SVG to Animation
                </Link>
              </div>
            </div>
            
            <div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: colors.text,
                marginBottom: '16px',
                transition: 'color 0.3s ease'
              }}>
                Resources
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://www.manim.community/" target="_blank" rel="noopener noreferrer" style={{
                  color: colors.textSecondary,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '0.95rem'
                }}>
                  Manim Community
                </a>
                <a href="https://docs.manim.community/" target="_blank" rel="noopener noreferrer" style={{
                  color: colors.textSecondary,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  fontSize: '0.95rem'
                }}>
                  Documentation
                </a>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{
              color: colors.textSecondary,
              fontSize: '0.9rem',
              transition: 'color 0.3s ease'
            }}>
              © 2024 ManiMagic. Made with ❤️ for the math community.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.textSecondary,
                fontSize: '1.5rem',
                transition: 'color 0.3s ease'
              }}
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
