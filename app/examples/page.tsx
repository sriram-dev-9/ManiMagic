"use client";
import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeProvider";
import { FaPlay, FaCode, FaCopy, FaExternalLinkAlt } from "react-icons/fa";

export default function ExamplesPage() {
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
    success: '#10b981'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const examples = [
    {
      id: 'hello-world',
      title: 'Hello World',
      description: 'Your first Manim animation',
      category: 'Basic',
      video: '/hello_world.mp4',
      code: `from manim import *

class HelloWorld(Scene):
    def construct(self):
        text = Text("Hello, World!", font_size=48)
        text.set_color(BLUE)
        
        self.play(Write(text), run_time=2)
        self.wait(1)
        self.play(FadeOut(text))`
    },
    {
      id: 'basic-shapes',
      title: 'Basic Shapes',
      description: 'Creating and animating geometric shapes',
      category: 'Shapes',
      video: '/basic_shapes.mp4',
      code: `from manim import *

class BasicShapes(Scene):
    def construct(self):
        circle = Circle(radius=1.5).set_color(BLUE)
        square = Square(side_length=2).set_color(RED)
        triangle = Triangle().set_color(GREEN)
        
        shapes = VGroup(circle, square, triangle)
        shapes.arrange(RIGHT, buff=1)
        
        self.play(Create(circle))
        self.play(Create(square))
        self.play(Create(triangle))
        self.wait(1)
        
        self.play(FadeOut(shapes))`
    },
    {
      id: 'mathematical-formula',
      title: 'Mathematical Formula',
      description: 'Animating mathematical expressions',
      category: 'Mathematics',
      video: '/mathematical_formula.mp4',
      code: `from manim import *

class MathematicalFormula(Scene):
    def construct(self):
        # Pythagorean theorem
        formula = MathTex("a^2 + b^2 = c^2")
        formula.scale(2)
        formula.set_color(YELLOW)
        
        self.play(Write(formula), run_time=3)
        self.wait(2)
        
        # Transform to specific values
        specific = MathTex("3^2 + 4^2 = 5^2")
        specific.scale(2)
        specific.set_color(GREEN)
        
        self.play(Transform(formula, specific))
        self.wait(2)`
    },
    {
      id: 'moving-objects',
      title: 'Moving Objects',
      description: 'Animating object movement and transformations',
      category: 'Animation',
      video: '/moving_objects.mp4',
      code: `from manim import *

class MovingObjects(Scene):
    def construct(self):
        # Create objects
        dot = Dot().set_color(RED)
        dot.move_to(LEFT * 3)
        
        circle = Circle().set_color(BLUE)
        circle.move_to(RIGHT * 3)
        
        self.play(Create(dot), Create(circle))
        
        # Move them around
        self.play(
            dot.animate.move_to(UP * 2),
            circle.animate.move_to(DOWN * 2),
            run_time=2
        )
        
        # Bring them together
        self.play(
            dot.animate.move_to(ORIGIN),
            circle.animate.move_to(ORIGIN),
            run_time=2
        )
        
        self.wait(1)`
    }
  ];

  const handleEditOnPlayground = (exampleCode: string) => {
    // Encode the code to pass it as a URL parameter
    const encodedCode = encodeURIComponent(exampleCode);
    window.open(`/play?code=${encodedCode}`, '_blank');
  };

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
          Example Animations
        </h1>
        <p style={{ 
          color: colors.textSecondary,
          transition: 'color 0.3s ease',
          fontSize: '1.25rem',
          maxWidth: '800px',
          margin: '0 auto 1rem auto',
          lineHeight: '1.6'
        }}>
          Here are example animations from the Manim community. 
          Each example includes interactive code that you can edit and run in our playground.
        </p>
        <a 
          href="https://docs.manim.community/en/stable/examples.html" 
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
          View More Examples on Manim Community <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
        </a>
      </div>

      {/* Examples List */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem'
        }}>
          {examples.map((example) => (
            <div
              key={example.id}
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                minHeight: '500px'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '60% 40%',
                gap: '0',
                minHeight: '500px'
              }}>
                {/* Video Section - 60% width */}
                <div style={{
                  background: colors.surfaceSecondary,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem',
                  borderRight: `1px solid ${colors.border}`,
                  position: 'relative'
                }}>
                  <video
                    src={example.video}
                    controls
                    loop
                    autoPlay
                    muted
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      height: 'auto',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      marginBottom: '1.5rem'
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      background: colors.accent,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {example.category}
                    </div>
                    <h2 style={{
                      color: colors.text,
                      margin: 0,
                      fontSize: '1.75rem',
                      fontWeight: '700'
                    }}>
                      {example.title}
                    </h2>
                  </div>
                  
                  <p style={{
                    color: colors.textSecondary,
                    margin: '0.75rem 0 0 0',
                    fontSize: '1rem',
                    textAlign: 'center',
                    maxWidth: '500px'
                  }}>
                    {example.description}
                  </p>
                </div>

                {/* Code Section - 40% width */}
                <div style={{ 
                  padding: '2rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    background: colors.surfaceSecondary,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    flex: 1,
                    marginBottom: '1.5rem',
                    position: 'relative',
                    overflow: 'auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `1px solid ${colors.border}`
                    }}>
                      <span style={{
                        color: colors.text,
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        Python Code
                      </span>
                      <button
                        onClick={() => copyToClipboard(example.code)}
                        style={{
                          background: 'transparent',
                          border: `1px solid ${colors.border}`,
                          color: colors.textSecondary,
                          cursor: 'pointer',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = colors.border;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                        title="Copy code"
                      >
                        <FaCopy /> Copy
                      </button>
                    </div>
                    
                    <pre style={{
                      margin: 0,
                      color: colors.text,
                      overflow: 'auto',
                      fontSize: '0.8rem',
                      lineHeight: '1.5'
                    }}>{example.code}</pre>
                  </div>

                  <button
                    onClick={() => handleEditOnPlayground(example.code)}
                    style={{
                      background: colors.accent,
                      color: 'white',
                      padding: '1rem 1.5rem',
                      borderRadius: '10px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(224, 122, 95, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(224, 122, 95, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(224, 122, 95, 0.3)';
                    }}
                  >
                    <FaCode size={18} /> Edit on Playground
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <h3 style={{ 
            color: colors.text, 
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Ready to Create Your Own?
          </h3>
          <p style={{ 
            color: colors.textSecondary,
            marginBottom: '1.5rem',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            Start with our playground and create stunning mathematical animations from scratch or modify these examples.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/play"
              style={{
                background: colors.accent,
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaPlay /> Open Playground
            </Link>
            <Link 
              href="/docs"
              style={{
                background: 'transparent',
                color: colors.text,
                border: `1px solid ${colors.border}`,
                padding: '1rem 2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📚 Read Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
