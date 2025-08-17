// Check for common Manim compatibility issues
function checkManimCompatibility(code: string): { isValid: boolean; error?: string; line?: number } {
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;
    
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) continue;
    
    // Check for deprecated weight="bold" parameter
    if (line.includes('weight="bold"') || line.includes("weight='bold'") || line.includes('font_weight=BOLD')) {
      return {
        isValid: false,
        error: 'Font weight parameters are not supported in this Manim version. Remove weight or font_weight parameters.',
        line: lineNumber
      };
    }
    
    // Check for common LaTeX issues
    if (line.includes('get_graph_label') && (line.includes('\\sin') || line.includes('\\cos') || line.includes('\\') && !line.includes('\\\\'))) {
      return {
        isValid: false,
        error: 'LaTeX expressions may cause errors. Consider using simple Text() objects instead.',
        line: lineNumber
      };
    }
    
    // Check for invalid escape sequences
    if (line.includes('\\s') || line.includes('\\c')) {
      if (!line.includes('\\sin') && !line.includes('\\cos') && !line.includes('\\\\')) {
        return {
          isValid: false,
          error: 'Invalid escape sequence. Use raw strings (r"...") or double backslashes.',
          line: lineNumber
        };
      }
    }
  }
  
  return { isValid: true };
}

// Simple Python syntax validator with Manim-specific checks
export function validatePythonSyntax(code: string): { isValid: boolean; error?: string; line?: number } {
  try {
    // Check for common Manim compatibility issues first
    const manimIssues = checkManimCompatibility(code);
    if (!manimIssues.isValid) {
      return manimIssues;
    }
    
    // Basic Python syntax checks
    const lines = code.split('\n');
    
    // Check for basic syntax issues
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;
      
      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;
      
      // Check for unclosed parentheses
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      if (openParens > closeParens && !line.endsWith('\\')) {
        // Check if it continues on next line
        let nextLineIndex = i + 1;
        let totalOpen = openParens;
        let totalClose = closeParens;
        
        while (nextLineIndex < lines.length) {
          const nextLine = lines[nextLineIndex].trim();
          if (!nextLine) {
            nextLineIndex++;
            continue;
          }
          
          totalOpen += (nextLine.match(/\(/g) || []).length;
          totalClose += (nextLine.match(/\)/g) || []).length;
          
          if (totalOpen === totalClose) break;
          if (totalClose > totalOpen) {
            return {
              isValid: false,
              error: "')' was never opened",
              line: nextLineIndex + 1
            };
          }
          
          nextLineIndex++;
          if (nextLineIndex >= lines.length && totalOpen > totalClose) {
            return {
              isValid: false,
              error: "'(' was never closed",
              line: lineNumber
            };
          }
        }
      }
      
      // Check for unclosed brackets
      const openBrackets = (line.match(/\[/g) || []).length;
      const closeBrackets = (line.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        if (openBrackets > closeBrackets) {
          return {
            isValid: false,
            error: "'[' was never closed",
            line: lineNumber
          };
        } else {
          return {
            isValid: false,
            error: "']' was never opened",
            line: lineNumber
          };
        }
      }
      
      // Check for unclosed braces
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        if (openBraces > closeBraces) {
          return {
            isValid: false,
            error: "'{' was never closed",
            line: lineNumber
          };
        } else {
          return {
            isValid: false,
            error: "'}' was never opened",
            line: lineNumber
          };
        }
      }
      
      // Check for basic indentation issues
      if (line.match(/^\s*def\s+/) || line.match(/^\s*class\s+/) || line.match(/^\s*if\s+/) || 
          line.match(/^\s*for\s+/) || line.match(/^\s*while\s+/) || line.match(/^\s*try\s*:/) ||
          line.match(/^\s*except\s*/) || line.match(/^\s*finally\s*:/) || line.match(/^\s*with\s+/)) {
        if (!line.endsWith(':')) {
          return {
            isValid: false,
            error: "Expected ':' at end of statement",
            line: lineNumber
          };
        }
      }
      
      // Check for invalid characters in variable names
      const varMatch = line.match(/^(\s*)([a-zA-Z_]\w*)\s*=/);
      if (varMatch) {
        const varName = varMatch[2];
        if (varName.match(/^\d/) || varName.includes('-')) {
          return {
            isValid: false,
            error: `Invalid variable name: ${varName}`,
            line: lineNumber
          };
        }
      }
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: "Syntax validation failed",
      line: 1
    };
  }
}
