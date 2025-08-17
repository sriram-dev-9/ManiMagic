import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Create temp directory
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "manimagic-"));
    const scriptPath = path.join(tempDir, "scene.py");
    
    // Write code to temp file
    fs.writeFileSync(scriptPath, code);

    // Extract class name from code (simple regex)
    const classMatch = code.match(/class\s+(\w+)\s*\(/);
    const className = classMatch ? classMatch[1] : "HelloManim";

    return new Promise((resolve) => {
      // Run Manim
      const proc = spawn("python", [
        "-m", "manim", 
        scriptPath, 
        className, 
        "--media_dir", tempDir,
        "-qm",
        "--format", "mp4"
      ], {
        cwd: tempDir,
        timeout: 60 * 1000,
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
          const response = new NextResponse(videoBuffer, {
            headers: {
              "Content-Type": "video/mp4",
              "Content-Disposition": "inline; filename=manim_animation.mp4",
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
    return NextResponse.json(
      { error: "Invalid request" }, 
      { status: 400 }
    );
  }
}
