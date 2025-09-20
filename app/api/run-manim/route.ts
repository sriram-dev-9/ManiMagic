import { spawn } from "child_process";
import fs, { link } from "fs";
import path from "path";
import os, { endianness } from "os";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let code: string;
    let uploadedFiles: any[] = [];

    // Check if request is FormData (for file uploads) or JSON
    const contentType = request.headers.get("content-type");
    console.log("Request content-type:", contentType);
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle FormData with file uploads
      const formData = await request.formData();
      code = formData.get("code") as string;
      console.log("FormData code length:", code?.length || 0);
      
      // Handle uploaded files
      const fileEntries = formData.getAll("file");
      console.log("Number of files in FormData:", fileEntries.length);
      
      for (const file of fileEntries) {
        if (file instanceof File) {
          console.log("Processing file:", file.name, "type:", file.type, "size:", file.size);
          uploadedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            content: await file.text()
          });
        }
      }
    } else {
      // Handle JSON request (from playground)
      const body = await request.json();
      code = body.code;
      
      // Convert files from {filename: content} format to array format
      if (body.files && typeof body.files === 'object') {
        // Handle object format: {filename: content}
        uploadedFiles = Object.entries(body.files).map(([filename, content]) => ({
          name: filename,
          content: content
        }));
      } else if (Array.isArray(body.files)) {
        // Handle array format (already correct)
        uploadedFiles = body.files;
      } else {
        uploadedFiles = [];
      }
    }
    
    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Create temp directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manimagic-"));
    const scriptPath = path.join(tempDir, "scene.py");
    
    // Write code to temp file
    fs.writeFileSync(scriptPath, code);

    // Create mock manim_play_timeline module if needed
    if (code.includes('manim_play_timeline')) {
      const timelineMockDir = path.join(tempDir, 'manim_play_timeline');
      fs.mkdirSync(timelineMockDir, { recursive: true });
      
      // Create __init__.py
      fs.writeFileSync(path.join(timelineMockDir, '__init__.py'), '');
      
      // Create timeline.py with mock Timeline class
      const timelineMock = `# Mock implementation of Timeline for manim_play_timeline
from manim import *
import numpy as np

class Timeline:
    """Mock Timeline class for manim_play_timeline"""
    
    def __init__(self, scene=None):
        self.animations = []
        self.current_time = 0
        self.scene = scene
    
    def set_scene(self, scene):
        """Set the scene for this timeline"""
        self.scene = scene
        return self
    
    def add_animation(self, animation_func, duration=1, **kwargs):
        """Add animation function with duration"""
        self.animations.append({
            'func': animation_func,
            'duration': duration,
            'start_time': self.current_time,
            'kwargs': kwargs
        })
        self.current_time += duration
        return self
    
    def add_pause(self, duration):
        """Add a pause/wait"""
        self.current_time += duration
        return self
    
    def play(self):
        """Play all animations in the timeline"""
        if not self.scene:
            return
        
        # Simple implementation: just run animations sequentially
        for anim in self.animations:
            if 'func' in anim:
                # For function-based animations, just call them with t=1
                try:
                    anim['func'](1.0)
                except:
                    pass
            
            # Add a small wait
            self.scene.wait(0.1)
    
    def wait(self, duration=1):
        """Mock wait method"""
        if self.scene:
            self.scene.wait(duration)
        self.current_time += duration
        return self
    
    def get_duration(self):
        """Get total timeline duration"""
        return self.current_time
`;
      fs.writeFileSync(path.join(timelineMockDir, 'timeline.py'), timelineMock);
    }

    // Create mock MF_Tools modules if needed
    if (code.includes('MF_Tools.easing') || code.includes('MF_Tools.color')) {
      const mfToolsDir = path.join(tempDir, 'MF_Tools');
      fs.mkdirSync(mfToolsDir, { recursive: true });
      
      // Create __init__.py
      fs.writeFileSync(path.join(mfToolsDir, '__init__.py'), 'from .easing import *\nfrom .color import *');
      
      // Create easing.py with mock functions
      const easingMock = `# Mock implementation of MF_Tools.easing
import numpy as np
from manim import *

def cubic_bezier(p0, p1, p2, p3):
    """
    Create a cubic bezier easing function
    Returns a function that takes t (0 to 1) and returns eased value
    """
    def bezier_func(t):
        if isinstance(t, (list, np.ndarray)):
            return [bezier_func(ti) for ti in t]
        
        # Cubic bezier formula
        u = 1 - t
        return (u**3 * p0 + 
                3 * u**2 * t * p1 + 
                3 * u * t**2 * p2 + 
                t**3 * p3)
    
    return bezier_func

def ease_in_out_cubic(t):
    """Ease in-out cubic function"""
    return cubic_bezier(0, 0, 1, 1)(t)

def ease_in_cubic(t):
    """Ease in cubic function"""
    return cubic_bezier(0, 0, 0.58, 1)(t)

def ease_out_cubic(t):
    """Ease out cubic function"""  
    return cubic_bezier(0.42, 0, 1, 1)(t)
`;
      fs.writeFileSync(path.join(mfToolsDir, 'easing.py'), easingMock);
      
      // Create color.py with mock functions
      const colorMock = `# Mock implementation of MF_Tools.color
import numpy as np
from manim import *

def color_gradient(colors, steps):
    """
    Create a color gradient between multiple colors
    colors: list of manim colors
    steps: number of steps in the gradient
    """
    if len(colors) < 2:
        return [colors[0]] * steps
    
    gradient = []
    segment_size = steps // (len(colors) - 1)
    
    for i in range(len(colors) - 1):
        start_color = colors[i]
        end_color = colors[i + 1]
        
        # Determine how many steps for this segment
        current_segment_size = segment_size
        if i == len(colors) - 2:  # Last segment gets remaining steps
            current_segment_size = steps - len(gradient)
        
        for j in range(current_segment_size):
            if current_segment_size == 1:
                alpha = 0
            else:
                alpha = j / (current_segment_size - 1)
            
            # Interpolate between colors
            interpolated = interpolate_color(start_color, end_color, alpha)
            gradient.append(interpolated)
    
    return gradient

def interpolate_colors(color1, color2, steps):
    """Interpolate between two colors with given steps"""
    return [interpolate_color(color1, color2, i / (steps - 1)) for i in range(steps)]
`;
      fs.writeFileSync(path.join(mfToolsDir, 'color.py'), colorMock);
    }

    // Handle uploaded files
    console.log("Processing uploaded files:", uploadedFiles?.length || 0);
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        console.log("Writing file:", file.name, "Content type:", typeof file.content, "Length:", file.content?.length);
        const filePath = path.join(tempDir, file.name);
        
        try {
          if (typeof file.content === 'string') {
            if (file.content.startsWith('data:')) {
              // Handle base64 encoded files (images)
              const base64Data = file.content.split(',')[1];
              const buffer = Buffer.from(base64Data, 'base64');
              fs.writeFileSync(filePath, buffer);
              console.log("✓ Wrote base64 file:", file.name);
            } else {
              // Handle text files (SVG content)
              fs.writeFileSync(filePath, file.content, 'utf8');
              console.log("✓ Wrote SVG file:", file.name, "Size:", file.content.length, "bytes");
            }
          } else {
            console.log("❌ Invalid file content type for:", file.name, typeof file.content);
          }
        } catch (fileError) {
          console.error("❌ Error writing file:", file.name, fileError);
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          throw new Error(`Failed to write file ${file.name}: ${errorMessage}`);
        }
      }
      
      // Debug: List all files in temp directory
      console.log("Files in temp directory:", fs.readdirSync(tempDir));
    }

    // Extract class name from code (simple regex)
    const classMatch = code.match(/class\s+(\w+)\s*\(/);
    const className = classMatch ? classMatch[1] : "HelloManim";

    return new Promise((resolve) => {
      // Ensure MiKTeX is in PATH for LaTeX support and clean up problematic paths
      const miktexPath = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64');
      let currentPath = process.env.PATH || '';
      
      // Remove problematic uv.exe paths that can cause MiKTeX issues
      currentPath = currentPath.split(';')
        .filter(p => !p.includes('uv.exe') && !p.includes('.local\\bin\\uv.exe'))
        .join(';');
      
      // Add MiKTeX path if not already present
      const enhancedPath = currentPath.includes('MiKTeX') ? currentPath : `${currentPath};${miktexPath}`;
      
      // Run Manim with optimized settings for web performance
      const proc = spawn("python", [
        "-m", "manim", 
        scriptPath, 
        className, 
        "--media_dir", tempDir,
        "-ql",  // Low quality for faster rendering and smaller files
        "--fps", "15",  // Lower FPS for smaller file size
        "--format", "mp4"
      ], {
        cwd: tempDir,
        timeout: 60 * 1000,
        env: {
          ...process.env,
          PATH: enhancedPath,
          // Ensure MiKTeX uses proper configuration
          MIKTEX_ENABLE_INSTALLER: "1",
          MIKTEX_AUTOINSTALL: "1"
        }
      });

      let errorMsg = "";
      let outputMsg = "";
      
      proc.stderr.on("data", (data) => {
        errorMsg += data.toString();
      });

      proc.stdout.on("data", (data) => {
        outputMsg += data.toString();
      });

      proc.on("close", (code) => {
        console.log(`Manim process exited with code: ${code}`);
        console.log(`stdout: ${outputMsg}`);
        console.log(`stderr: ${errorMsg}`);
        // Find the output video file
        const mediaDir = path.join(tempDir, "videos");
        let videoPath = null;

        try {
          // Look for mp4 files recursively
          const findMp4 = (dir: string): string | null => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
              const filePath = path.join(dir, file);
              const stat = fs.statSync(filePath);
              if (stat.isDirectory()) {
                const result = findMp4(filePath);
                if (result) return result;
              } else if (file.endsWith('.mp4')) {
                return filePath;
              }
            }
            return null;
          };

          if (fs.existsSync(mediaDir)) {
            videoPath = findMp4(mediaDir);
          }
        } catch (e) {
          console.error("Error finding video file:", e);
        }

        if (code !== 0 || !videoPath || !fs.existsSync(videoPath)) {
          const fullError = `Exit code: ${code}\nstdout: ${outputMsg}\nstderr: ${errorMsg}`;
          console.error("Manim execution failed:", fullError);
          resolve(NextResponse.json(
            { error: errorMsg || "Manim execution failed", details: fullError }, 
            { status: 500 }
          ));
          fs.rmSync(tempDir, { recursive: true, force: true });
          return;
        }

        try {
          const videoBuffer = fs.readFileSync(videoPath);
          
          // Get file stats for better streaming
          const stats = fs.statSync(videoPath);
          
          const response = new NextResponse(videoBuffer, {
            headers: {
              "Content-Type": "video/mp4",
              "Content-Disposition": "inline; filename=manim_animation.mp4",
              "Content-Length": stats.size.toString(),
              "Accept-Ranges": "bytes",
              "Cache-Control": "public, max-age=3600", // Cache for 1 hour
              "Connection": "keep-alive",
            },
          });
          
          // Clean up temp directory
          fs.rmSync(tempDir, { recursive: true, force: true });
          resolve(response);
        } catch (e) {
          resolve(NextResponse.json(
            { error: "Failed to read video file" }, 
            { status: 500 }
          ));
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      });

      proc.on("error", (err) => {
        resolve(NextResponse.json(
          { error: `Process error: ${err.message}` }, 
          { status: 500 }
        ));
        fs.rmSync(tempDir, { recursive: true, force: true });
      });
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}




































































