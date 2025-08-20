"use client";
import React from "react";
import Link from "next/link";
import { FaPlay, FaCode, FaImage, FaGithub, FaArrowRight } from "react-icons/fa";

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  hero: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    textAlign: 'center' as const,
  },
  logo: {
    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
    color: 'white',
    borderRadius: '16px',
    padding: '16px',
    display: 'inline-flex',
    marginBottom: '32px',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '24px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#6b7280',
    marginBottom: '32px',
    maxWidth: '800px',
    margin: '0 auto 32px auto',
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
    marginBottom: '80px',
  },
  primaryButton: {
    background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'transform 0.2s',
    border: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '2px solid #d1d5db',
    color: '#374151',
    padding: '16px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    background: 'white',
  },
  features: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 80px 20px',
  },
  featuresTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#1f2937',
    marginBottom: '48px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  },
  featureDescription: {
    color: '#6b7280',
    lineHeight: '1.6',
  },
  footer: {
    background: '#1f2937',
    color: 'white',
    padding: '48px 20px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '24px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap' as const,
  },
  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
};

export default function Homepage() {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.logo}>
          <FaPlay style={{ width: '48px', height: '48px' }} />
        </div>
        
        <h1 style={styles.title}>ManiMagic</h1>
        
        <p style={styles.subtitle}>
          Create stunning mathematical animations with ease. 
          Build, preview, and export beautiful Manim animations right in your browser.
        </p>
        
        <div style={styles.buttonContainer}>
          <Link href="/playground" style={styles.primaryButton}>
            <FaPlay style={{ width: '20px', height: '20px' }} />
            Start Creating
            <FaArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
          
          <Link href="/svg-to-animation" style={styles.secondaryButton}>
            <FaImage style={{ width: '20px', height: '20px' }} />
            SVG to Animation
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>
          Everything you need to create amazing animations
        </h2>
        
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#dbeafe', color: '#2563eb'}}>
              <FaCode style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 style={styles.featureTitle}>Interactive Playground</h3>
            <p style={styles.featureDescription}>
              Write Manim code with syntax highlighting, error detection, and instant preview. 
              No setup required - just start coding!
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#ede9fe', color: '#7c3aed'}}>
              <FaImage style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 style={styles.featureTitle}>SVG to Animation</h3>
            <p style={styles.featureDescription}>
              Upload your SVG files and automatically generate beautiful Manim animations. 
              Perfect for logos, icons, and graphics.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={{...styles.featureIcon, background: '#dcfce7', color: '#16a34a'}}>
              <FaPlay style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 style={styles.featureTitle}>Instant Preview</h3>
            <p style={styles.featureDescription}>
              See your animations come to life instantly. Export as MP4 or share with others. 
              No waiting, no hassle.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <div style={{...styles.logo, marginBottom: 0}}>
              <FaPlay style={{ width: '20px', height: '20px' }} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>ManiMagic</span>
          </div>
          
          <div style={styles.footerLinks}>
            <Link href="/playground" style={styles.footerLink}>
              Playground
            </Link>
            <Link href="/svg-to-animation" style={styles.footerLink}>
              SVG to Animation
            </Link>
            <Link href="/docs" style={styles.footerLink}>
              Docs
            </Link>
            <a
              href="https://github.com/Jagan-Dev-9/ManiMagic"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.footerLink}
            >
              <FaGithub style={{ width: '20px', height: '20px' }} />
            </a>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid #374151', marginTop: '32px', paddingTop: '32px', textAlign: 'center', color: '#9ca3af' }}>
          <p>&copy; 2025 ManiMagic. Built with ❤️ for the animation community.</p>
        </div>
      </footer>
    </div>
  );
}
