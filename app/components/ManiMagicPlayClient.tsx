"use client";
import React, { useState, useEffect } from "react";
import { FaPlay, FaDownload, FaExclamationCircle, FaExpand, FaCompress, FaCode, FaCopy, FaCheck, FaSpinner, FaUpload } from "react-icons/fa";
import CodeEditor from "./CodeEditor";
import { validatePythonSyntax } from "../utils/pythonValidator";
import { useTheme } from "./ThemeProvider";

const DEFAULT_CODE = `from manim import *

class HelloManim(Scene):
    def construct(self):
        # Create simple text
        text = Text("Hello Manim!", font_size=48)
        text.set_color(BLUE)
        
        # Animate the text
        self.play(Write(text), run_time=2)
        self.wait(1)
        self.play(FadeOut(text), run_time=1)
`;

export default function ManiMagicPlayClient() {
  const { theme, currentTheme } = useTheme();

  // Define colors based on current theme
  const colors = {
    background: currentTheme.background,
    surface: currentTheme.mobileBg,
    surfaceSecondary: currentTheme.cardBg,
    text: currentTheme.text,
    textSecondary: currentTheme.textSecondary,
    textMuted: currentTheme.textMuted,
    border: currentTheme.border,
    active: currentTheme.active,
    activeBg: currentTheme.activeBg,
    activeBorder: currentTheme.activeBorder,
    hoverBg: currentTheme.hoverBg,
    buttonBg: currentTheme.buttonBg,
    buttonHover: currentTheme.buttonHover,
    inputBg: currentTheme.inputBg,
    // Additional colors for playground specific needs
    warning: '#fbbf24',
    success: '#10b981',
    error: '#ef4444',
    accent: '#e07a5f'
  };

  // Template examples for Manim code
  const templates = [
    {
      name: "Basic Shapes",
      description: "Create and animate basic geometric shapes",
      code: `from manim import *

class BasicShapes(Scene):
    def construct(self):
        # Create basic shapes
        circle = Circle(radius=1).set_color(BLUE)
        square = Square(side_length=2).set_color(RED)
        triangle = Triangle().set_color(GREEN)

        # Position them
        circle.move_to(LEFT * 3)
        square.move_to(ORIGIN)
        triangle.move_to(RIGHT * 3)

        # Animate
        self.play(Create(circle), Create(square), Create(triangle))
        self.wait(1)

        # Transform
        self.play(
            Transform(circle, square.copy().move_to(LEFT * 3)),
            Transform(square, triangle.copy().move_to(ORIGIN)),
            Transform(triangle, circle.copy().move_to(RIGHT * 3))
        )
        self.wait(2)`
    },
    {
      name: "Mathematical Function",
      description: "Plot and animate mathematical functions",
      code: `from manim import *
import numpy as np

class FunctionPlot(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-2, 2, 1],
            x_length=6,
            y_length=4
        )

        # Create function
        func = axes.plot(lambda x: np.sin(x), color=BLUE)
        func_label = Text("y = sin(x)", font_size=24).next_to(func, UP)

        # Animate
        self.play(Create(axes))
        self.play(Create(func), Write(func_label))
        self.wait(2)

        # Transform to cosine
        cos_func = axes.plot(lambda x: np.cos(x), color=RED)
        cos_label = Text("y = cos(x)", font_size=24).next_to(cos_func, UP)

        self.play(
            Transform(func, cos_func),
            Transform(func_label, cos_label)
        )
        self.wait(2)`
    },
    {
      name: "Simple Animation",
      description: "Basic circle animations and transformations",
      code: `from manim import *

class SimpleAnimation(Scene):
    def construct(self):
        # Create a circle
        circle = Circle(radius=1)
        circle.set_fill(PINK, opacity=0.5)

        # Animate the circle
        self.play(Create(circle))
        self.play(circle.animate.shift(LEFT * 2))
        self.play(circle.animate.scale(2))
        self.play(circle.animate.shift(RIGHT * 4))
        self.play(circle.animate.scale(0.5))
        self.wait(1)`
    },
    {
      name: "Text Animation",
      description: "Working with text objects and animations",
      code: `from manim import *

class TextAnimation(Scene):
    def construct(self):
        # Create text
        text1 = Text("Welcome to ManiMagic!", font_size=36)
        text2 = Text("Create Beautiful Animations", font_size=24)
        text2.next_to(text1, DOWN, buff=0.5)

        # Animate text
        self.play(Write(text1))
        self.wait(0.5)
        self.play(FadeIn(text2, shift=UP))
        self.wait(1)

        # Transform text
        new_text = Text("Let's Animate!", font_size=48, color=BLUE)
        self.play(Transform(text1, new_text), FadeOut(text2))
        self.wait(2)`
    },
    {
      name: "Plugin Test",
      description: "Simple test of manim plugins",
      code: `from manim import *

class SimplePluginTest(Scene):
    def construct(self):
        # Create a basic shape
        dot = Dot(radius=0.3).set_color(RED).move_to(LEFT * 2)

        # Add dot to scene
        self.add(dot)

        # Simple movement animation
        self.play(dot.animate.move_to(RIGHT * 2).set_color(BLUE), run_time=2)

        # Simple scale animation
        self.play(dot.animate.scale(2).set_color(GREEN), run_time=1)
        self.wait(1)`
    }
  ];

  const [code, setCode] = useState(DEFAULT_CODE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<{
    type: string; 
    line?: string; 
    column?: string;
    message: string; 
    details: string;
    suggestion?: string;
    severity?: 'error' | 'warning';
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const loadExample = (example: { name: string; description: string; code: string }) => {
    setCode(example.code);
    setShowExamples(false);
    setError(null);
    setVideoUrl(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle URL parameters when the component mounts
  useEffect(() => {
    if (mounted) {
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get('code');
      
      if (codeParam) {
        try {
          const decodedCode = decodeURIComponent(codeParam);
          setCode(decodedCode);
          // Clear the URL parameter after setting the code
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        } catch (error) {
          console.error('Error decoding code parameter:', error);
        }
      }
    }
  }, [mounted]);

  // Load code and SVG file from localStorage when coming from SVG to Animation
  useEffect(() => {
    if (mounted) {
      const savedCode = localStorage.getItem("playgroundCode");
      const savedSvgContent = localStorage.getItem("playgroundSvgContent");
      const savedSvgFile = localStorage.getItem("playgroundSvgFile");

      if (savedCode) {
        setCode(savedCode);
        // Clear the saved code so it doesn't persist
        localStorage.removeItem("playgroundCode");
      }

      if (savedSvgContent && savedSvgFile) {
        try {
          const fileInfo = JSON.parse(savedSvgFile);
          // Store the SVG content as an uploaded file
          setUploadedFiles(prev => ({
            ...prev,
            [fileInfo.name]: savedSvgContent
          }));
          // Clear the saved SVG data
          localStorage.removeItem("playgroundSvgContent");
          localStorage.removeItem("playgroundSvgFile");
        } catch (error) {
          console.error("Error parsing saved SVG file data:", error);
        }
      }
    }
  }, [mounted]);

  // Close examples dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExamples) {
        const target = event.target as Element;
        if (!target.closest('[data-examples-dropdown]')) {
          setShowExamples(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExamples]);

  // Function to parse and format error messages for better readability
  const parseError = (errorText: string) => {
    try {
      const errorObj = JSON.parse(errorText);
      const fullError = errorObj.error || errorText;
      const errorDetails = errorObj.details || '';
      
      // Font weight error specific handling
      if (fullError.includes('There is no Font Weight Called') || 
          fullError.includes('KeyError: \'bold\'') ||
          fullError.includes('unexpected keyword argument \'font_weight\'')) {
        return {
          type: 'Font Weight Error',
          message: 'Font weight parameters are not supported. Remove weight or font_weight parameters entirely.',
          details: 'In Manim v0.19+, font weight parameters are not supported. Use normal text without weight styling.'
        };
      }
      
      // LaTeX/FileNotFoundError specific handling
      if (fullError.includes('FileNotFoundError') && fullError.includes('tex')) {
        return {
          type: 'LaTeX Error',
          message: 'LaTeX is not properly installed or configured. Mathematical expressions require LaTeX.',
          details: 'Solution: Install MiKTeX from https://miktex.org/ or use Text() objects instead of mathematical notation.\n\nFor Windows: Run "winget install MiKTeX.MiKTeX" in PowerShell as Administrator.'
        };
      }
      
      // KeyError specific handling (general)
      if (fullError.includes('KeyError')) {
        const keyMatch = fullError.match(/KeyError: ['"](.*?)['"]/)
        const keyName = keyMatch ? keyMatch[1] : 'unknown'
        return {
          type: 'KeyError',
          message: `Key "${keyName}" not found. This might be due to Manim version compatibility or missing configuration.`,
          details: errorDetails || fullError
        };
      }
      
      // AttributeError for missing methods/properties
      if (fullError.includes('AttributeError')) {
        const attrMatch = fullError.match(/AttributeError: .* has no attribute ['"](.*?)['"]/)
        if (attrMatch) {
          return {
            type: 'Attribute Error',
            message: `Property/method "${attrMatch[1]}" not found. This might be due to Manim version differences.`,
            details: 'Check Manim documentation for the correct method name in your version.'
          };
        }
      }
      
      // Import errors
      if (fullError.includes('ImportError') || fullError.includes('ModuleNotFoundError')) {
        return {
          type: 'Import Error',
          message: 'Required module not found. Make sure Manim and all dependencies are properly installed.',
          details: errorDetails || fullError
        };
      }
      
      // Extract syntax errors
      const syntaxErrorMatch = fullError.match(/File ".*?", line (\d+)\s*(.*?)\s*SyntaxError: (.+)/);
      if (syntaxErrorMatch) {
        return {
          type: 'Syntax Error',
          line: syntaxErrorMatch[1],
          message: syntaxErrorMatch[3],
          details: syntaxErrorMatch[2]?.trim() || errorDetails
        };
      }
      
      // Extract runtime errors
      const runtimeErrorMatch = fullError.match(/(\w+Error): (.+?)(?:\r?\n|$)/);
      if (runtimeErrorMatch) {
        return {
          type: runtimeErrorMatch[1],
          message: runtimeErrorMatch[2],
          details: errorDetails
        };
      }
      
      // Extract line information from traceback
      const lineMatch = fullError.match(/line (\d+)/);
      const line = lineMatch ? lineMatch[1] : null;
      
      return {
        type: 'Error',
        line,
        message: fullError.length > 200 ? fullError.substring(0, 200) + '...' : fullError,
        details: errorDetails
      };
    } catch {
      return {
        type: 'Error',
        message: errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText,
        details: ''
      };
    }
  };

  const handleRun = async () => {
    // First validate Python syntax with enhanced error information
    const syntaxValidation = validatePythonSyntax(code);
    if (!syntaxValidation.isValid) {
      setError({
        type: syntaxValidation.severity === 'warning' ? 'Compatibility Warning' : 'Syntax Error',
        line: syntaxValidation.line?.toString(),
        column: syntaxValidation.column?.toString(),
        message: syntaxValidation.error || 'Invalid Python syntax',
        details: syntaxValidation.suggestion || getSuggestion(syntaxValidation.error || ''),
        suggestion: syntaxValidation.suggestion,
        severity: syntaxValidation.severity || 'error'
      });
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/run-manim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code,
          files: uploadedFiles 
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        setError(parseError(err));
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      setVideoUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      setError({
        type: 'Network Error',
        message: 'Failed to connect to server. Please try again.',
        details: ''
      });
    }
    setLoading(false);
  };

  // Function to automatically fix common Manim compatibility issues
  const autoFixCode = (code: string): string => {
    let fixedCode = code;
    
    // Fix weight="bold" and font_weight=BOLD by removing them entirely
    fixedCode = fixedCode.replace(/,?\s*weight=["']bold["']/g, '');
    fixedCode = fixedCode.replace(/,?\s*font_weight=BOLD/g, '');
    
    // Fix set_fill_by_gradient with multiple colors (v0.19.0+ compatibility)
    fixedCode = fixedCode.replace(
      /(\w+)\.set_fill_by_gradient\s*\(([^)]+)\)/g,
      (match, objectName, colors) => {
        const colorArray = colors.split(',').map((c: string) => c.trim());
        if (colorArray.length > 2) {
          // Convert to set_color_by_gradient for multiple colors
          return `${objectName}.set_color_by_gradient(${colors})`;
        }
        return match; // Keep as is if only 2 colors
      }
    );
    
    // Clean up any double commas that might result from removal
    fixedCode = fixedCode.replace(/,\s*,/g, ',');
    fixedCode = fixedCode.replace(/\(\s*,/g, '(');
    
    // Fix common LaTeX graph labels
    fixedCode = fixedCode.replace(
      /axes\.get_graph_label\([^,]+,\s*label=["']([^"']*\\\w+[^"']*)["']\)/g,
      (match, labelText) => {
        // Convert LaTeX to simple text
        const simpleText = labelText.replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\/g, '');
        return `Text("${simpleText}", font_size=24).next_to(func, UP)`;
      }
    );
    
    // Fix invalid escape sequences in strings
    fixedCode = fixedCode.replace(/(?<!\\)\\([sc])(?!in|os)/g, '\\\\$1');
    
    // Fix common typos like extra text after function calls
    fixedCode = fixedCode.replace(/(\([^)]*\))\s*([a-zA-Z]\w*)\s*$/gm, '$1');
    
    return fixedCode;
  };

  // Function to export code as a .py file
  const exportCode = () => {
    try {
      // Extract class name from code for filename
      const classMatch = code.match(/class\s+(\w+)\s*\(/);
      const className = classMatch ? classMatch[1] : "manim_scene";
      
      // Add helpful comments at the top
      const exportContent = `# Manim Animation Code
# Generated from ManiMagic Play
# Run with: python -m manim ${className.toLowerCase()}.py ${className} -pql

${code}

# To run this animation:
# 1. Make sure Manim is installed: pip install manim
# 2. Run: python -m manim ${className.toLowerCase()}.py ${className} -pql
# 3. Add --format=gif for GIF output
`;
      
      // Create blob with the code content
      const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${className.toLowerCase()}.py`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Function to provide suggestions for common issues
  const getSuggestion = (errorMessage: string): string => {
    if (errorMessage.includes('weight') || errorMessage.includes('font_weight')) {
      return 'Remove weight="bold" or font_weight=BOLD parameters entirely. They are not supported in this Manim version.';
    }
    if (errorMessage.includes('set_fill_by_gradient')) {
      return 'Use set_color_by_gradient() for multiple colors, or set_fill_by_gradient() with only 2 colors in Manim v0.19.0+.';
    }
    if (errorMessage.includes('LaTeX')) {
      return 'Replace mathematical expressions with simple Text objects. Example: Text("y = sin(x)") instead of LaTeX.';
    }
    if (errorMessage.includes('escape sequence')) {
      return 'Use raw strings like r"\\text" or double backslashes like "\\\\text".';
    }
    return '';
  };

  // File handling functions
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      if (file.type.startsWith('image/') || file.name.endsWith('.svg')) {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedFiles(prev => ({
            ...prev,
            [file.name]: result
          }));
          
          // Auto-insert appropriate code based on file type
          let codeToInsert = '';
          if (file.name.endsWith('.svg')) {
            codeToInsert = `
# Load and use uploaded SVG: ${file.name}
# Note: In actual Manim, you would use SVGMobject("path/to/${file.name}")
svg_obj = SVGMobject("${file.name}")
svg_obj.scale(0.5)  # Adjust size as needed
self.add(svg_obj)
`;
          } else {
            codeToInsert = `
# Load and use uploaded image: ${file.name}
# Note: In actual Manim, you would use ImageMobject("path/to/${file.name}")
image = ImageMobject("${file.name}")
image.scale(0.5)  # Adjust size as needed
self.add(image)
`;
          }
          setCode(prev => prev + codeToInsert);
        };
        
        if (file.name.endsWith('.svg')) {
          reader.readAsText(file); // SVG files are text-based
        } else {
          reader.readAsDataURL(file); // Other images as base64
        }
      } else if (file.type === 'text/plain' || file.name.endsWith('.py')) {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedFiles(prev => ({
            ...prev,
            [file.name]: result
          }));
          
          // For Python files, give option to replace or append
          if (file.name.endsWith('.py')) {
            if (confirm(`Replace current code with ${file.name}?`)) {
              setCode(result);
            } else {
              setCode(prev => prev + '\n\n# Imported from ' + file.name + '\n' + result);
            }
          }
        };
        reader.readAsText(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedFiles(prev => ({
            ...prev,
            [file.name]: result
          }));
          
          // Auto-insert JSON loading code
          const jsonCode = `
# Load and use uploaded JSON data: ${file.name}
import json
# In actual usage, you would load: data = json.load(open("${file.name}"))
# For demo: data = ${result}
`;
          setCode(prev => prev + jsonCode);
        };
        reader.readAsText(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeFile = (filename: string) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[filename];
      return newFiles;
    });
  };

  // Function to copy code to clipboard with visual feedback
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: colors.textSecondary
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 32,
            height: 32,
            border: `2px solid ${colors.border}`,
            borderTop: `2px solid ${colors.active}`,
            borderRadius: "50%",
            margin: "0 auto 12px",
            animation: "spin 1s linear infinite"
          }} />
          <p>Loading ManiMagic Play...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spinAnimation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spinAnimation 1s linear infinite;
        }
      `}</style>
      <div style={{
        height: "100vh",
        background: colors.background,
        color: colors.text,
        display: "flex",
        flexDirection: "column",
        userSelect: isResizing ? 'none' : 'auto',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto'
      }}>
        {/* Header */}
        <header style={{ 
          padding: "16px 24px",
          borderBottom: `1px solid ${colors.border}`,
          background: colors.surface,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h1 style={{ 
              fontWeight: 800, 
              fontSize: 24, 
              margin: 0,
              letterSpacing: 0.5,
              color: colors.active
            }}>
              ManiMagic Play
            </h1>
            <p style={{ 
              fontSize: 13, 
              color: colors.textSecondary, 
              margin: "2px 0 0 0" 
            }}>
              Interactive Manim Animation Playground
            </p>
          </div>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }} data-examples-dropdown>
              <button
                onClick={() => setShowExamples(!showExamples)}
                style={{
                  background: showExamples ? colors.border : "transparent",
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13
                }}
              >
                <FaCode />
                Examples
              </button>
              
              {showExamples && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: colors.surfaceSecondary,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: 8,
                  minWidth: 200,
                  zIndex: 1000,
                  boxShadow: theme === 'dark' ? "0 10px 25px rgba(0, 0, 0, 0.5)" : "0 10px 25px rgba(0, 0, 0, 0.1)"
                }}>
                  {templates.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(example)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: colors.text,
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: 4,
                        fontSize: 13,
                        marginBottom: index < templates.length - 1 ? 4 : 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{example.name}</div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>{example.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                background: "transparent",
                border: `1px solid ${colors.border}`,
                color: colors.textSecondary,
                borderRadius: 6,
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13
              }}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div style={{
          flex: 1,
          display: "flex",
          position: "relative",
          height: "calc(100vh - 120px)",
          overflow: "hidden"
        }}>
          {/* Left Panel - Code Editor */}
          <div style={{
            width: `${leftWidth}%`,
            background: colors.surface,
            display: "flex",
            flexDirection: "column",
            minWidth: "300px"
          }}>
            <div style={{
              padding: "3.4px 20px",
              borderBottom: `1px solid ${colors.border}`,
              background: colors.surfaceSecondary,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: colors.warning
                }} />
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text
                }}>
                  scene.py
                </span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={exportCode}
                  title="Export Python code as .py file"
                  style={{
                    background: colors.success,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                    boxShadow: `0 2px 4px rgba(16, 185, 129, 0.2)`
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background = theme === 'dark' ? "#047857" : "#059669";
                    (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = colors.success;
                    (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  <FaDownload style={{ fontSize: 11 }} /> 
                  Export
                </button>
                
                <label
                  htmlFor="file-upload"
                  title="Upload images, SVG files, data files, or Python code"
                  style={{
                    background: "transparent",
                    color: colors.text,
                    border: "none",
                    borderRadius: 6,
                    padding: "8px",
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = colors.accent;
                    (e.target as HTMLElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  <FaUpload style={{ fontSize: 14 }} />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".py,.txt,.json,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  style={{ display: "none" }}
                />
                
                <button
                  onClick={copyCode}
                  title={copySuccess ? "Copied to clipboard!" : "Copy code to clipboard"}
                  style={{
                    background: copySuccess ? colors.success : "transparent",
                    color: colors.text,
                    border: "none",
                    borderRadius: 6,
                    padding: "8px",
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    transition: "all 0.15s ease",
                    transform: copySuccess ? "scale(1.1)" : "scale(1)"
                  }}
                  onMouseEnter={(e) => {
                    if (!copySuccess) {
                      (e.target as HTMLButtonElement).style.background = colors.success;
                      (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copySuccess) {
                      (e.target as HTMLButtonElement).style.background = "transparent";
                      (e.target as HTMLButtonElement).style.transform = "scale(1)";
                    }
                  }}
                >
                  {copySuccess ? <FaCheck style={{ fontSize: 14 }} /> : <FaCopy style={{ fontSize: 14 }} />}
                </button>
                
                <button
                  onClick={handleRun}
                  disabled={loading}
                  title={loading ? "Running..." : "Run"}
                  style={{
                    background: loading ? colors.textMuted : "transparent",
                    color: colors.text,
                    border: "none",
                    borderRadius: 6,
                    padding: "8px",
                    fontSize: 14,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    opacity: loading ? 0.8 : 1,
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.target as HTMLButtonElement).style.background = colors.active;
                      (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      (e.target as HTMLButtonElement).style.background = "transparent";
                      (e.target as HTMLButtonElement).style.transform = "scale(1)";
                    }
                  }}
                >
                  {loading ? (
                    <FaSpinner 
                      className="spinning"
                      style={{ fontSize: 14 }} 
                    />
                  ) : (
                    <FaPlay style={{ fontSize: 14 }} />
                  )}
                </button>
              </div>
            </div>
            
            <div 
              style={{ 
                flex: 1, 
                position: "relative",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Drag and Drop Overlay */}
              {isDragOver && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: theme === 'dark' ? "rgba(96, 165, 250, 0.1)" : "rgba(59, 130, 246, 0.1)",
                  borderWidth: "2px",
                  borderStyle: "dashed",
                  borderColor: colors.active,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  borderRadius: 8,
                  margin: 8
                }}>
                  <div style={{ textAlign: "center", color: colors.active, fontSize: 16, fontWeight: 600 }}>
                    📁 Drop files here to upload
                    <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                      Supports: .py, .txt, .json, images, .svg
                    </div>
                  </div>
                </div>
              )}
              
              {/* Uploaded Files Section */}
              {Object.keys(uploadedFiles).length > 0 && (
                <div style={{
                  padding: "8px 12px",
                  background: colors.surface,
                  borderBottom: `1px solid ${colors.border}`,
                  maxHeight: "120px",
                  overflowY: "auto"
                }}>
                  <div style={{ fontSize: 12, color: colors.text, marginBottom: 6, fontWeight: 600, opacity: 0.7 }}>
                    📁 Uploaded Files ({Object.keys(uploadedFiles).length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Object.keys(uploadedFiles).map(filename => (
                      <div 
                        key={filename}
                        style={{
                          background: colors.border,
                          borderRadius: 4,
                          padding: "4px 8px",
                          fontSize: 11,
                          color: colors.text,
                          display: "flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        <span>{filename}</span>
                        <button
                          onClick={() => removeFile(filename)}
                          style={{
                            background: "none",
                            border: "none",
                            color: colors.error,
                            cursor: "pointer",
                            padding: 0,
                            fontSize: 12
                          }}
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{ flex: 1, overflow: "hidden" }}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  height="100%"
                  errorLine={error?.line ? parseInt(error.line) : undefined}
                  errorColumn={error?.column ? parseInt(error.column) : undefined}
                  errorMessage={error?.message}
                  theme={theme}
                />
              </div>
            </div>
          </div>

          {/* Resizer */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: 4,
              background: isResizing ? colors.active : colors.border,
              cursor: "col-resize",
              position: "relative",
              transition: isResizing ? "none" : "background 0.2s ease",
              zIndex: 10
            }}
          >
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 32,
              background: isResizing ? colors.active : colors.border,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <div style={{
                width: 2,
                height: 16,
                background: theme === 'dark' ? '#374151' : '#6b7280',
                borderRadius: 1,
                marginRight: 1
              }} />
              <div style={{
                width: 2,
                height: 16,
                background: theme === 'dark' ? '#374151' : '#6b7280',
                borderRadius: 1
              }} />
            </div>
          </div>

          {/* Right Panel - Animation Preview */}
          <div style={{
            width: `${100 - leftWidth}%`,
            background: colors.surface,
            display: "flex",
            flexDirection: "column",
            minWidth: "300px"
          }}>
            <div style={{
              padding: "12px 20px",
              borderBottom: `1px solid ${colors.border}`,
              background: colors.background,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: videoUrl ? colors.success : colors.border
                }} />
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.text
                }}>
                  Preview
                </span>
              </div>
              
              {videoUrl && (
                <a
                  href={videoUrl}
                  download="manim_animation.mp4"
                  style={{
                    background: colors.success,
                    color: "#fff",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease"
                  }}
                >
                  <FaDownload style={{ fontSize: 11 }} /> Download
                </a>
              )}
            </div>

            <div style={{ 
              flex: 1, 
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "calc(100vh - 200px)",
              overflow: "hidden"
            }}>
              {loading && (
                <div style={{
                  textAlign: "center",
                  color: colors.textSecondary
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    border: `2px solid ${colors.border}`,
                    borderTop: `2px solid ${colors.active}`,
                    borderRadius: "50%",
                    margin: "0 auto 12px",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ fontSize: 14, margin: 0 }}>
                    Generating animation...
                  </p>
                </div>
              )}

              {error && !loading && (
                <div style={{
                  background: theme === 'dark' ? "#4c1d1d" : "#fef2f2",
                  border: `1px solid ${colors.error}`,
                  borderRadius: 8,
                  padding: 16,
                  width: "100%",
                  maxHeight: "70%",
                  overflow: "auto"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10
                  }}>
                    <FaExclamationCircle style={{ 
                      fontSize: 16, 
                      color: colors.error, 
                      marginTop: 2,
                      flexShrink: 0 
                    }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: "0 0 8px 0", 
                        fontSize: 14, 
                        fontWeight: 600, 
                        color: error.severity === 'warning' ? colors.warning : colors.error,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}>
                        {error.severity === 'warning' ? '⚠️' : '❌'} 
                        {error.type} 
                        {error.line && (
                          <span style={{ 
                            background: `rgba(239, 68, 68, 0.2)`,
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 500
                          }}>
                            Line {error.line}{error.column && `:${error.column}`}
                          </span>
                        )}
                      </h3>
                      
                      <div style={{ 
                        margin: "0 0 12px 0", 
                        fontSize: 13, 
                        color: theme === 'dark' ? "#fecaca" : "#991b1b",
                        fontFamily: 'JetBrains Mono, monospace',
                        background: theme === 'dark' ? "#3f1f1f" : "#fee2e2",
                        padding: "10px",
                        borderRadius: "6px",
                        border: `1px solid ${theme === 'dark' ? '#7f1d1d' : '#fecaca'}`,
                        lineHeight: 1.4
                      }}>
                        {error.message}
                      </div>
                      
                      {error.suggestion && (
                        <div style={{
                          background: "#1e3a8a",
                          border: "1px solid #3b82f6",
                          borderRadius: 6,
                          padding: "10px",
                          margin: "0 0 12px 0"
                        }}>
                          <div style={{ 
                            fontSize: 12, 
                            fontWeight: 600, 
                            color: "#93c5fd",
                            marginBottom: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}>
                            💡 How to fix this:
                          </div>
                          <div style={{ 
                            fontSize: 12, 
                            color: "#dbeafe",
                            lineHeight: 1.4
                          }}>
                            {error.suggestion}
                          </div>
                        </div>
                      )}
                      
                      {error.details && !error.suggestion && (
                        <div style={{ 
                          margin: "0 0 12px 0", 
                          fontSize: 11, 
                          color: "#fecaca",
                          fontFamily: 'JetBrains Mono, monospace',
                          background: "rgba(0,0,0,0.3)",
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #4c5265",
                          lineHeight: 1.4,
                          opacity: 0.8
                        }}>
                          {error.details}
                        </div>
                      )}
                      
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {(error.type === 'Font Weight Error' || 
                          error.type === 'Syntax Error' || 
                          error.type === 'Compatibility Warning') && (
                          <button
                            onClick={() => {
                              const fixedCode = autoFixCode(code);
                              if (fixedCode !== code) {
                                setCode(fixedCode);
                                setError(null);
                              }
                            }}
                            style={{
                              background: "#166534",
                              border: "1px solid #22c55e",
                              borderRadius: 6,
                              color: "#bbf7d0",
                              padding: "8px 14px",
                              fontSize: 12,
                              cursor: "pointer",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 6
                            }}
                          >
                            🔧 Auto Fix Code
                          </button>
                        )}
                        
                        <button
                          onClick={() => setError(null)}
                          style={{
                            background: "transparent",
                            border: "1px solid #4c5265",
                            borderRadius: 6,
                            color: "#94a3b8",
                            padding: "8px 14px",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 500
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {videoUrl && !loading && !error && (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "calc(100vh - 250px)",
                    borderRadius: 8, 
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    background: "#212129"
                  }}
                />
              )}

              {!loading && !error && !videoUrl && (
                <div style={{
                  textAlign: "center",
                  color: "#64748b"
                }}>
                  <div style={{
                    fontSize: 40,
                    marginBottom: 12,
                    opacity: 0.4
                  }}>
                    🎬
                  </div>
                  <p style={{ fontSize: 16, margin: "0 0 4px 0", fontWeight: 500 }}>
                    Ready to animate
                  </p>
                  <p style={{ fontSize: 13, margin: 0, opacity: 0.7 }}>
                    Click "Run" to see your Manim code in action
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          padding: "12px 24px",
          fontSize: 12, 
          color: colors.textMuted,
          borderTop: `1px solid ${colors.border}`,
          background: colors.surface,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            Powered by{" "}
            <a 
              href="https://manim.community/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: colors.active, textDecoration: "none" }}
            >
              Manim Community
            </a>
          </div>
          <div>
            <a 
              href="https://github.com/Jagan-Dev-9/ManiMagic" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: colors.accent, textDecoration: "none" }}
            >
              View on GitHub
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
