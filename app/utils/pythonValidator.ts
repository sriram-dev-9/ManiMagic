import { parser } from '@lezer/python';

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
    
    // Check for set_fill_by_gradient with multiple arguments (v0.19.0+ compatibility)
    if (line.includes('set_fill_by_gradient') && line.includes(',')) {
      const match = line.match(/set_fill_by_gradient\s*\(([^)]+)\)/);
      if (match && match[1].split(',').length > 2) {
        return {
          isValid: false,
          error: 'set_fill_by_gradient() only accepts 2 colors in Manim v0.19.0+. Use multiple calls or set_color_by_gradient() instead.',
          line: lineNumber
        };
      }
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

// Professional Python syntax validator using Lezer parser
export function validatePythonSyntax(code: string): { 
  isValid: boolean; 
  error?: string; 
  line?: number;
  column?: number;
  suggestion?: string;
  severity?: 'error' | 'warning';
} {
  try {
    // Check for common Manim compatibility issues first
    const manimIssues = checkManimCompatibility(code);
    if (!manimIssues.isValid) {
      return {
        ...manimIssues,
        severity: 'warning'
      };
    }
    
    // Use Lezer Python parser for real syntax validation
    const tree = parser.parse(code);
    
    // Check for syntax errors in the parse tree
    let hasError = false;
    let errorLine: number | undefined;
    let errorColumn: number | undefined;
    let errorMessage = 'Syntax error detected';
    let suggestion = '';
    
    tree.iterate({
      enter(node) {
        if (node.type.isError) {
          hasError = true;
          // Calculate line and column number from position
          const lines = code.substring(0, node.from).split('\n');
          errorLine = lines.length;
          errorColumn = lines[lines.length - 1].length + 1;
          
          // Get the problematic text and surrounding context
          const errorText = code.substring(node.from, node.to);
          const lineContent = code.split('\n')[errorLine - 1] || '';
          
          // Provide more specific error messages and suggestions
          if (errorText.includes('(') && !lineContent.includes(')')) {
            errorMessage = 'Unclosed parenthesis - missing closing ")"';
            suggestion = 'Add a closing parenthesis ")" to match the opening one.';
          } else if (errorText.includes('[') && !lineContent.includes(']')) {
            errorMessage = 'Unclosed bracket - missing closing "]"';
            suggestion = 'Add a closing bracket "]" to match the opening one.';
          } else if (errorText.includes('{') && !lineContent.includes('}')) {
            errorMessage = 'Unclosed brace - missing closing "}"';
            suggestion = 'Add a closing brace "}" to match the opening one.';
          } else if (lineContent.trim().endsWith(',')) {
            errorMessage = 'Unexpected comma at end of line';
            suggestion = 'Remove the trailing comma or add the next item in the list.';
          } else if (lineContent.includes('def ') && !lineContent.includes(':')) {
            errorMessage = 'Function definition missing colon ":"';
            suggestion = 'Add a colon ":" at the end of the function definition line.';
          } else if (lineContent.includes('class ') && !lineContent.includes(':')) {
            errorMessage = 'Class definition missing colon ":"';
            suggestion = 'Add a colon ":" at the end of the class definition line.';
          } else if (lineContent.includes('if ') && !lineContent.includes(':')) {
            errorMessage = 'If statement missing colon ":"';
            suggestion = 'Add a colon ":" at the end of the if condition.';
          } else if (lineContent.includes('for ') && !lineContent.includes(':')) {
            errorMessage = 'For loop missing colon ":"';
            suggestion = 'Add a colon ":" at the end of the for statement.';
          } else if (lineContent.includes('while ') && !lineContent.includes(':')) {
            errorMessage = 'While loop missing colon ":"';
            suggestion = 'Add a colon ":" at the end of the while condition.';
          } else if (errorText.includes('"') && (errorText.match(/"/g) || []).length % 2 === 1) {
            errorMessage = 'Unclosed string - missing closing quote';
            suggestion = 'Add a closing quote to match the opening quote.';
          } else if (errorText.includes("'") && (errorText.match(/'/g) || []).length % 2 === 1) {
            errorMessage = 'Unclosed string - missing closing quote';
            suggestion = 'Add a closing quote to match the opening quote.';
          } else if (lineContent.includes('=') && lineContent.split('=').length > 2) {
            errorMessage = 'Invalid assignment - use "==" for comparison';
            suggestion = 'Use "==" for equality comparison or check your assignment syntax.';
          } else if (errorText.match(/\w+\s*$/) && lineContent.includes('(') && lineContent.includes(')')) {
            errorMessage = 'Unexpected text after expression';
            suggestion = 'Remove the extra text at the end of the line or check for typos.';
          } else {
            errorMessage = `Syntax error near: "${errorText.trim() || 'unexpected token'}"`;
            suggestion = 'Check the syntax around this location. Look for missing colons, parentheses, or quotes.';
          }
          
          return false; // Stop iteration after first error
        }
      }
    });
    
    if (hasError) {
      return {
        isValid: false,
        error: errorMessage,
        line: errorLine,
        column: errorColumn,
        suggestion: suggestion,
        severity: 'error'
      };
    }
    
    return { isValid: true };
    
  } catch (error) {
    // If parser fails, allow the code through (better to let Python handle it)
    console.warn('Python syntax validation failed:', error);
    return { isValid: true };
  }
}
