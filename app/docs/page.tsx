"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeProvider";
import { FaPlay, FaCode, FaUpload, FaArrowRight, FaChevronDown, FaChevronRight, FaCopy, FaExternalLinkAlt } from "react-icons/fa";

export default function DocsPage() {
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

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
    success: '#10b981'
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      content: (
        <div>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            ManiMagic is a browser-based platform for creating mathematical animations using Manim. 
            Get started in seconds without any installation required.
          </p>
          
          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Quick Start
          </h3>
          
          <ol style={{ 
            paddingLeft: '1.5rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.8'
          }}>
            <li>Navigate to the <Link href="/play" style={{ color: colors.accent, textDecoration: 'none' }}>Playground</Link></li>
            <li>Choose from our template examples or start with the default code</li>
            <li>Modify the code to create your animation</li>
            <li>Click "Run Animation" to generate your video</li>
            <li>Download your animation when ready</li>
          </ol>

          <div style={{
            background: colors.surfaceSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ 
              color: colors.text, 
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              💡 Pro Tip
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Start with our template examples to understand Manim syntax, then customize them to create your own unique animations.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'playground',
      title: 'Using the Playground',
      content: (
        <div>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            The Playground is your main workspace for creating Manim animations. It features a split-screen interface 
            with a code editor on the left and animation preview on the right.
          </p>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Features
          </h3>

          <ul style={{ 
            paddingLeft: '1.5rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.8'
          }}>
            <li><strong>Live Code Editor:</strong> Syntax highlighting for Python/Manim code</li>
            <li><strong>Template Examples:</strong> Pre-built animations to get you started</li>
            <li><strong>Real-time Preview:</strong> See your animation results instantly</li>
            <li><strong>Export Options:</strong> Download animations as MP4 files</li>
            <li><strong>Fullscreen Mode:</strong> Distraction-free editing experience</li>
            <li><strong>Resizable Panels:</strong> Adjust the layout to your preference</li>
          </ul>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Basic Example
          </h3>

          <div style={{
            background: colors.surfaceSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <button
              onClick={() => copyToClipboard(`from manim import *

class HelloWorld(Scene):
    def construct(self):
        text = Text("Hello, Manim!", font_size=48)
        text.set_color(BLUE)
        
        self.play(Write(text), run_time=2)
        self.wait(1)
        self.play(FadeOut(text))`)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: colors.textSecondary,
                cursor: 'pointer',
                padding: '0.25rem'
              }}
              title="Copy to clipboard"
            >
              <FaCopy />
            </button>
            <pre style={{
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: '1.4',
              color: colors.text,
              overflow: 'auto'
            }}>{`from manim import *

class HelloWorld(Scene):
    def construct(self):
        text = Text("Hello, Manim!", font_size=48)
        text.set_color(BLUE)
        
        self.play(Write(text), run_time=2)
        self.wait(1)
        self.play(FadeOut(text))`}</pre>
          </div>
        </div>
      )
    },
    {
      id: 'svg-animations',
      title: 'SVG to Animation',
      content: (
        <div>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            Transform your SVG graphics into beautiful Manim animations with our SVG to Animation tool. 
            Perfect for logos, icons, and custom graphics.
          </p>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            How to Use
          </h3>

          <ol style={{ 
            paddingLeft: '1.5rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.8'
          }}>
            <li>Visit the <Link href="/svg-to-animation" style={{ color: colors.accent, textDecoration: 'none' }}>SVG to Animation</Link> page</li>
            <li>Upload your SVG file by dragging and dropping or clicking to browse</li>
            <li>Optionally add a tagline text that will appear below your SVG</li>
            <li>Click "Generate Animation" to create your video</li>
            <li>Use "Edit on Playground" to customize the animation code</li>
          </ol>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Best Practices
          </h3>

          <ul style={{ 
            paddingLeft: '1.5rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.8'
          }}>
            <li>Use clean, simple SVG files for best results</li>
            <li>Ensure your SVG has proper vector paths (not rasterized images)</li>
            <li>Keep file sizes reasonable (under 1MB recommended)</li>
            <li>Test with different taglines to see what works best</li>
          </ul>

          <div style={{
            background: colors.surfaceSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4 style={{ 
              color: colors.text, 
              marginBottom: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              ⚡ Quick Tip
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              The generated animation will draw your SVG path by path, then fill it with color. 
              You can customize this behavior by editing the code in the Playground.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'manim-basics',
      title: 'Manim Basics',
      content: (
        <div>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            Manim is a mathematical animation engine created by Grant Sanderson (3Blue1Brown). 
            Learn the fundamentals to create your own mathematical visualizations.
          </p>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Scene Structure
          </h3>

          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            Every Manim animation is built around a <code style={{ 
              background: colors.surfaceSecondary, 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>Scene</code> class with a <code style={{ 
              background: colors.surfaceSecondary, 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>construct</code> method:
          </p>

          <div style={{
            background: colors.surfaceSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <pre style={{
              margin: 0,
              fontSize: '0.85rem',
              lineHeight: '1.4',
              color: colors.text
            }}>{`from manim import *

class MyScene(Scene):
    def construct(self):
        # Your animation code goes here
        pass`}</pre>
          </div>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Common Objects
          </h3>

          <ul style={{ 
            paddingLeft: '1.5rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.8'
          }}>
            <li><strong>Text:</strong> <code style={{ background: colors.surfaceSecondary, padding: '0.25rem', borderRadius: '4px' }}>Text("Hello")</code></li>
            <li><strong>Shapes:</strong> <code style={{ background: colors.surfaceSecondary, padding: '0.25rem', borderRadius: '4px' }}>Circle(), Square(), Triangle()</code></li>
            <li><strong>Math:</strong> <code style={{ background: colors.surfaceSecondary, padding: '0.25rem', borderRadius: '4px' }}>MathTex("x^2 + y^2 = r^2")</code></li>
            <li><strong>Plots:</strong> <code style={{ background: colors.surfaceSecondary, padding: '0.25rem', borderRadius: '4px' }}>axes.plot(lambda x: x**2)</code></li>
          </ul>

          <h3 style={{ 
            color: colors.text, 
            marginBottom: '0.75rem', 
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Animation Types
          </h3>

          <ul style={{ 
            paddingLeft: '1.5rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.8'
          }}>
            <li><strong>Create:</strong> Draw objects onto the scene</li>
            <li><strong>Write:</strong> Animate text being written</li>
            <li><strong>Transform:</strong> Morph one object into another</li>
            <li><strong>FadeIn/FadeOut:</strong> Gradually show/hide objects</li>
            <li><strong>Animate:</strong> Move, scale, or rotate objects</li>
          </ul>
        </div>
      )
    },
    {
      id: 'resources',
      title: 'Additional Resources',
      content: (
        <div>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Expand your knowledge with these helpful resources for learning Manim and mathematical animation.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: colors.surfaceSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h4 style={{ 
                color: colors.text, 
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Official Documentation
              </h4>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Comprehensive guide to all Manim features, objects, and animations.
              </p>
              <a 
                href="https://docs.manim.community/en/stable/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: colors.accent,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Visit Documentation <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
              </a>
            </div>

            <div style={{
              background: colors.surfaceSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h4 style={{ 
                color: colors.text, 
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                3Blue1Brown Channel
              </h4>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Watch the creator of Manim explain complex mathematical concepts with beautiful animations.
              </p>
              <a 
                href="https://www.youtube.com/c/3blue1brown" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: colors.accent,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Watch Videos <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
              </a>
            </div>

            <div style={{
              background: colors.surfaceSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h4 style={{ 
                color: colors.text, 
                marginBottom: '0.75rem',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                Manim Community Examples
              </h4>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Browse hundreds of community-created examples and animations for inspiration.
              </p>
              <a 
                href="https://docs.manim.community/en/stable/examples.html" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: colors.accent,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                View More Examples <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
              </a>
              <Link 
                href="/examples"
                style={{
                  color: colors.accent,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                View Our Examples <FaPlay style={{ fontSize: '0.8rem' }} />
              </Link>
            </div>
          </div>

          <div style={{
            background: colors.surfaceSecondary,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4 style={{ 
              color: colors.text, 
              marginBottom: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              🚀 Ready to Start?
            </h4>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Jump into the playground and start creating your first mathematical animation!
            </p>
            <Link 
              href="/play"
              style={{
                background: colors.accent,
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaPlay /> Open Playground
            </Link>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ 
      paddingTop: "64px", 
      minHeight: "100vh", 
      background: colors.background,
      transition: 'background 0.3s ease'
    }}>
      <Navbar />
      
      {/* Header */}
      <div style={{
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          marginBottom: "1rem", 
          color: colors.text,
          transition: 'color 0.3s ease',
          fontWeight: 'bold'
        }}>
          Documentation
        </h1>
        <p style={{ 
          color: colors.textSecondary,
          transition: 'color 0.3s ease',
          fontSize: '1.25rem',
          maxWidth: '600px',
          margin: '0 auto 1rem auto',
          lineHeight: '1.6'
        }}>
          Learn how to create stunning mathematical animations with ManiMagic
        </p>
        <a 
          href="https://docs.manim.community/en/stable/index.html" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: colors.accent,
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          View More on Manim Community <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
        </a>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {sections.map((section) => (
          <div 
            key={section.id}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              marginBottom: '1rem',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              style={{
                width: '100%',
                padding: '1.5rem',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: colors.text,
                fontSize: '1.25rem',
                fontWeight: '600',
                transition: 'background 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.surfaceSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span>{section.title}</span>
              {expandedSections.includes(section.id) ? (
                <FaChevronDown style={{ color: colors.textSecondary }} />
              ) : (
                <FaChevronRight style={{ color: colors.textSecondary }} />
              )}
            </button>
            
            {expandedSections.includes(section.id) && (
              <div style={{
                padding: '0 1.5rem 1.5rem',
                borderTop: `1px solid ${colors.border}`,
                color: colors.textSecondary,
                lineHeight: '1.6'
              }}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}