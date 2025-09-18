# 🎬 ManiMagic

**Create stunning mathematical animations with ease**

ManiMagic is a web-based interactive playground for creating beautiful mathematical animations using the powerful Manim library. Built with Next.js and featuring a modern, responsive interface, ManiMagic makes mathematical visualization accessible to everyone.

[![GitHub stars](https://img.shields.io/github/stars/Jagan-Dev-9/ManiMagic)](https://github.com/Jagan-Dev-9/ManiMagic)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![Manim](https://img.shields.io/badge/Manim-Community-blue)](https://manim.community/)

## ✨ Features

### 🎯 **Interactive Playground**
- **Split-screen interface** with live code editor and animation preview
- **Syntax highlighting** and error detection for Python/Manim code
- **Real-time preview** - see your animations come to life instantly
- **Resizable panels** for optimal workspace customization
- **Template library** with ready-to-use examples

### 🎨 **Advanced Code Editor**
- **CodeMirror integration** with Python syntax highlighting
- **Dark/Light theme support** that syncs across the entire application
- **Error highlighting** with line-by-line feedback
- **Auto-indentation** and code formatting
- **Tab support** for proper code structure

### 🚀 **Animation Engine**
- **Manim Community Edition** backend for professional-quality animations
- **Server-side rendering** using Python subprocess for reliable execution
- **Plugin support** including timeline and MF_Tools extensions
- **High-quality MP4 export** for sharing and presentation
- **Error handling** with detailed feedback and suggestions

### 📁 **SVG to Animation**
- **Upload SVG files** and automatically generate Manim animations
- **Logo animation creator** with customizable taglines
- **Automatic scaling** and positioning for optimal results
- **GitHub-style reveal effects** for professional presentations

### 🎭 **Theme System**
- **Dark/Light mode toggle** with persistent preferences
- **Consistent theming** across all components
- **Smooth transitions** between theme changes
- **Accessibility-focused** color schemes

### 📱 **Responsive Design**
- **Mobile-friendly interface** that works on all devices
- **Flexible layouts** that adapt to different screen sizes
- **Touch-friendly controls** for tablet and mobile users

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15.4.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://reactjs.org/)** - Modern React with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[CodeMirror 6](https://codemirror.net/)** - Advanced code editor
- **[React Icons](https://react-icons.github.io/react-icons/)** - Beautiful icon library

### Backend & Animation
- **[Manim Community](https://manim.community/)** - Mathematical animation engine
- **[Python 3.x](https://www.python.org/)** - Server-side animation rendering
- **Node.js API Routes** - RESTful backend services
- **File System Integration** - Temporary file handling for animations

### Code Editor Features
- **[@codemirror/lang-python](https://www.npmjs.com/package/@codemirror/lang-python)** - Python language support
- **[@codemirror/theme-one-dark](https://www.npmjs.com/package/@codemirror/theme-one-dark)** - Dark theme
- **[@replit/codemirror-indentation-markers](https://www.npmjs.com/package/@replit/codemirror-indentation-markers)** - Visual indentation guides

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and npm/yarn
- **Python 3.8+** with pip
- **Manim Community Edition** installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jagan-Dev-9/ManiMagic.git
   cd ManiMagic
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install manim
   pip install manim[jupyterlab]  # Optional: for Jupyter integration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup (Alternative)
```bash
# Pull the pre-built image
docker pull jagandev9/manimagic:latest

# Run the container
docker run -p 3000:3000 jagandev9/manimagic:latest
```

## 📖 Usage Guide

### Basic Animation Creation

1. **Open the Playground** - Navigate to `/play` in your browser
2. **Choose a template** - Click "Examples" to browse pre-built animations
3. **Edit the code** - Modify the Python/Manim code in the left panel
4. **Run animation** - Click the "Run" button to generate your animation
5. **Download result** - Export your animation as MP4 when ready

### Example: Creating Your First Animation

```python
from manim import *

class HelloManiMagic(Scene):
    def construct(self):
        # Create text
        welcome_text = Text("Hello ManiMagic!", font_size=48)
        welcome_text.set_color(BLUE)
        
        # Animate the text
        self.play(Write(welcome_text), run_time=2)
        self.wait(1)
        
        # Transform to new text
        goodbye_text = Text("Let's create amazing animations!", font_size=24)
        self.play(Transform(welcome_text, goodbye_text))
        self.wait(2)
```

### SVG Animation Workflow

1. **Navigate to SVG Tool** - Go to `/svg-to-animation`
2. **Upload SVG file** - Drag and drop or click to upload your SVG
3. **Add tagline** - Enter optional text to accompany your animation
4. **Generate animation** - Click "Generate Animation" to create Manim code
5. **Customize further** - Copy code to playground for additional modifications

## 🎯 Core Features Deep Dive

### Interactive Playground (`/play`)
- **Real-time editing** with immediate visual feedback
- **Error detection** and helpful suggestions
- **Template library** with categorized examples:
  - Basic Shapes and Transformations
  - Mathematical Functions and Plots
  - Text Animations and Typography
  - Complex Geometric Constructions
  - Plugin Integration Examples

### Code Editor Capabilities
- **Syntax validation** for Python and Manim-specific functions
- **Auto-completion** for common Manim objects and methods
- **Error highlighting** with line and column precision
- **Bracket matching** and code folding
- **Configurable indentation** (tabs/spaces)

### Animation Engine Features
- **Professional rendering** using Manim Community's latest version
- **Plugin ecosystem** support for extended functionality
- **Error handling** with detailed stack traces
- **Performance optimization** for faster rendering
- **Quality settings** for different output requirements

### Theme and Accessibility
- **WCAG 2.1 compliant** color schemes
- **High contrast modes** for better visibility
- **Keyboard navigation** support throughout the interface
- **Screen reader compatibility** with proper ARIA labels

## 🔧 API Reference

### Animation Generation Endpoint

**POST** `/api/run-manim`

Generate a Manim animation from Python code.

```javascript
// Request body
{
  "code": "from manim import *\n\nclass MyScene(Scene):\n    def construct(self):\n        circle = Circle()\n        self.play(Create(circle))"
}

// Response
{
  "success": true,
  "videoUrl": "/path/to/generated/animation.mp4",
  "logs": "Manim execution logs..."
}
```

### SVG Processing Endpoint

**POST** `/api/svg-to-animation`

Convert SVG files to Manim animation code.

```javascript
// Request body (FormData)
{
  "svgFile": File,
  "tagline": "Optional tagline text"
}

// Response
{
  "success": true,
  "code": "Generated Manim Python code",
  "videoUrl": "/path/to/preview/animation.mp4"
}
```

## 🎨 Customization

### Theme Configuration

ManiMagic supports custom themes through the `ThemeProvider` component:

```typescript
// app/components/ThemeProvider.tsx
export const themes = {
  dark: {
    background: '#212129',
    surface: '#323949',
    text: '#f8fafc',
    active: '#60a5fa',
    // ... more colors
  },
  light: {
    background: '#ece6e2',
    surface: '#ffffff',
    text: '#343434',
    active: '#454866',
    // ... more colors
  }
}
```

### Adding Custom Templates

Add new animation templates to the examples array:

```typescript
// app/components/ManiMagicPlayClient.tsx
const templates = [
  {
    name: "Your Template Name",
    description: "Description of what this template does",
    code: `from manim import *

class YourCustomScene(Scene):
    def construct(self):
        # Your custom Manim code here
        pass`
  }
  // ... more templates
];
```

## 🤝 Contributing

We welcome contributions to ManiMagic! Here's how you can help:

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
4. **Make your changes** and test thoroughly
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description

### Contribution Guidelines

- **Follow TypeScript best practices** and maintain type safety
- **Write clear, documented code** with meaningful variable names
- **Test your changes** across different browsers and devices
- **Update documentation** for any new features or API changes
- **Respect the existing code style** and formatting

### Areas We Need Help With

- 🐛 **Bug fixes** and performance improvements
- 📚 **Documentation** and tutorial creation
- 🎨 **UI/UX enhancements** and accessibility improvements
- 🔧 **New Manim templates** and example animations
- 🌐 **Internationalization** support
- 📱 **Mobile experience** optimizations

## 📊 Project Statistics

- **Lines of Code**: ~15,000+ (TypeScript, Python, CSS)
- **Components**: 20+ React components
- **API Endpoints**: 5+ RESTful services
- **Animation Templates**: 10+ ready-to-use examples
- **Supported Formats**: MP4, SVG input
- **Theme Variants**: Dark, Light modes

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] **Real-time collaboration** - Multiple users editing simultaneously
- [ ] **Animation gallery** - Community-shared animations
- [ ] **Advanced export options** - GIF, WebM, different quality settings
- [ ] **Interactive tutorials** - Step-by-step learning modules
- [ ] **Plugin marketplace** - Easy installation of Manim extensions

### Version 2.1 (Future)
- [ ] **AI-assisted coding** - Generate animations from natural language
- [ ] **Version control integration** - Git-based project management
- [ ] **Team workspaces** - Collaborative animation projects
- [ ] **Performance analytics** - Rendering time optimization
- [ ] **Custom shader support** - Advanced visual effects

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Jagan-Dev-9

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **[Grant Sanderson (3Blue1Brown)](https://www.3blue1brown.com/)** - Creator of Manim
- **[Manim Community](https://manim.community/)** - Maintaining and developing Manim
- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[CodeMirror](https://codemirror.net/)** - Powerful code editor component
- **[React Icons](https://react-icons.github.io/react-icons/)** - Beautiful icon library

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs and request features](https://github.com/Jagan-Dev-9/ManiMagic/issues)
- **Documentation**: [Comprehensive guides and examples](https://manimagic.dev/docs)
- **Community**: [Join our Discord server](https://discord.gg/manimagic)
- **Email**: [jagan.dev.9@gmail.com](mailto:jagan.dev.9@gmail.com)

## 🌟 Show Your Support

If you find ManiMagic helpful, please consider:

- ⭐ **Starring the repository** on GitHub
- 🐛 **Reporting bugs** and suggesting improvements
- 📢 **Sharing with others** who might benefit from mathematical animation
- 💝 **Contributing** to the project development

---

**Made with ❤️ by [Jagan-Dev-9](https://github.com/Jagan-Dev-9)**

*Create. Animate. Inspire.*