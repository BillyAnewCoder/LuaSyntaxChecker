import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Download, Upload, Code, Bug } from 'lucide-react';

// Import CodeMirror
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/lint/lint.css';

declare global {
  interface Window {
    CodeMirror: any;
  }
}

interface LintError {
  from: { line: number; ch: number };
  to: { line: number; ch: number };
  message: string;
  severity: 'error' | 'warning';
}

interface CodeEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

export default function CodeEditor({ 
  initialCode = '', 
  onCodeChange 
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const cmInstanceRef = useRef<any>(null);
  const [errors, setErrors] = useState<LintError[]>([]);
  const [theme, setTheme] = useState('default');
  const [activeTab, setActiveTab] = useState<'editor' | 'issues'>('editor');
  const [code, setCode] = useState(initialCode || `-- Welcome to Lua Syntax Checker
-- Start typing your Lua code here

function greet(name)
    if name then
        print("Hello, " .. name .. "!")
    else
        print("Hello, World!")
    end
end

-- Example with potential syntax error (uncomment to test):
-- function broken_function(
--     print("Missing closing parenthesis")

greet("Developer")

-- Try some advanced Lua features:
local numbers = {1, 2, 3, 4, 5}
for i, v in ipairs(numbers) do
    print("Index: " .. i .. ", Value: " .. v)
end

-- Coroutine example
local co = coroutine.create(function()
    for i = 1, 3 do
        print("Coroutine step: " .. i)
        coroutine.yield()
    end
end)

coroutine.resume(co)
`);

  const errorCount = errors.length;

  // Enhanced Lua syntax checker
  const checkLuaSyntax = (code: string): LintError[] => {
    const errors: LintError[] = [];
    const lines = code.split('\n');
    
    // Stack to track opening brackets/parentheses
    const stack: Array<{char: string, line: number, ch: number}> = [];
    const pairs: {[key: string]: string} = {'(': ')', '[': ']', '{': '}'};
    
    // Keywords that should be followed by specific patterns
    const blockKeywords = ['function', 'if', 'for', 'while', 'repeat', 'do'];
    const endKeywords = ['end', 'until'];
    
    let blockStack: Array<{keyword: string, line: number}> = [];
    
    lines.forEach((line, lineIndex) => {
      let inString = false;
      let inComment = false;
      let stringChar = '';
      let i = 0;
      
      while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        // Handle comments
        if (!inString && char === '-' && nextChar === '-') {
          inComment = true;
          i += 2;
          continue;
        }
        
        if (inComment) {
          i++;
          continue;
        }
        
        // Handle strings
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && line[i-1] !== '\\') {
          inString = false;
          stringChar = '';
        }
        
        if (!inString) {
          // Check for bracket matching
          if ('([{'.includes(char)) {
            stack.push({char, line: lineIndex, ch: i});
          } else if (')]}'.includes(char)) {
            if (stack.length === 0) {
              errors.push({
                from: {line: lineIndex, ch: i},
                to: {line: lineIndex, ch: i + 1},
                message: `Unexpected closing '${char}'`,
                severity: 'error'
              });
            } else {
              const last = stack.pop()!;
              if (pairs[last.char] !== char) {
                errors.push({
                  from: {line: lineIndex, ch: i},
                  to: {line: lineIndex, ch: i + 1},
                  message: `Mismatched brackets: expected '${pairs[last.char]}' but found '${char}'`,
                  severity: 'error'
                });
              }
            }
          }
        }
        
        i++;
      }
      
      // Check for block structure
      const trimmedLine = line.trim();
      
      // Check for block keywords
      blockKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`);
        if (regex.test(trimmedLine) && !trimmedLine.startsWith('--')) {
          blockStack.push({keyword, line: lineIndex});
        }
      });
      
      // Check for end keywords
      if (trimmedLine === 'end' && !trimmedLine.startsWith('--')) {
        if (blockStack.length === 0) {
          errors.push({
            from: {line: lineIndex, ch: 0},
            to: {line: lineIndex, ch: line.length},
            message: "Unexpected 'end' - no matching block statement",
            severity: 'error'
          });
        } else {
          blockStack.pop();
        }
      }
      
      if (trimmedLine === 'until' && !trimmedLine.startsWith('--')) {
        const lastBlock = blockStack[blockStack.length - 1];
        if (!lastBlock || lastBlock.keyword !== 'repeat') {
          errors.push({
            from: {line: lineIndex, ch: 0},
            to: {line: lineIndex, ch: line.length},
            message: "'until' without matching 'repeat'",
            severity: 'error'
          });
        } else {
          blockStack.pop();
        }
      }
      
      // Check for common syntax errors
      if (trimmedLine.includes('function') && trimmedLine.includes('(') && !trimmedLine.includes(')')) {
        const openParen = trimmedLine.indexOf('(');
        if (!trimmedLine.substring(openParen).includes(')')) {
          errors.push({
            from: {line: lineIndex, ch: openParen},
            to: {line: lineIndex, ch: line.length},
            message: "Unclosed function parameter list",
            severity: 'error'
          });
        }
      }
      
      // Check for missing 'then' after 'if'
      if (trimmedLine.includes('if ') && !trimmedLine.includes('then') && !trimmedLine.startsWith('--')) {
        errors.push({
          from: {line: lineIndex, ch: 0},
          to: {line: lineIndex, ch: line.length},
          message: "Missing 'then' after 'if' statement",
          severity: 'warning'
        });
      }
      
      // Check for missing 'do' after 'for' or 'while'
      if ((trimmedLine.includes('for ') || trimmedLine.includes('while ')) && !trimmedLine.includes('do') && !trimmedLine.startsWith('--')) {
        errors.push({
          from: {line: lineIndex, ch: 0},
          to: {line: lineIndex, ch: line.length},
          message: "Missing 'do' after loop statement",
          severity: 'warning'
        });
      }
    });
    
    // Check for unclosed brackets
    stack.forEach(item => {
      errors.push({
        from: {line: item.line, ch: item.ch},
        to: {line: item.line, ch: item.ch + 1},
        message: `Unclosed '${item.char}'`,
        severity: 'error'
      });
    });
    
    // Check for unclosed blocks
    blockStack.forEach(block => {
      const message = block.keyword === 'repeat' 
        ? `Unclosed '${block.keyword}' block - missing 'until'`
        : `Unclosed '${block.keyword}' block - missing 'end'`;
      
      errors.push({
        from: {line: block.line, ch: 0},
        to: {line: block.line, ch: 10},
        message,
        severity: 'error'
      });
    });
    
    return errors;
  };

  // Handler functions
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.lua';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        if (cmInstanceRef.current) {
          cmInstanceRef.current.setValue(content);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    // Load CodeMirror CSS
    const loadCSS = (href: string) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    // Load CodeMirror scripts
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeCodeMirror = async () => {
      try {
        // Load CSS files
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css');
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material.min.css');
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/monokai.min.css');
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css');
        loadCSS('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/lint.min.css');

        // Load JavaScript files
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/lua/lua.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/lint/lint.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/keymap/sublime.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/matchbrackets.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/edit/closebrackets.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/addon/search/searchcursor.min.js');

        if (editorRef.current && (window as any).CodeMirror) {
          const cm = (window as any).CodeMirror.fromTextArea(editorRef.current, {
            mode: 'lua',
            theme: theme,
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            indentWithTabs: false,
            keyMap: 'sublime',
            gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers'],
            lint: {
              getAnnotations: (text: string) => {
                const errors = checkLuaSyntax(text);
                return errors.map(error => ({
                  from: (window as any).CodeMirror.Pos(error.from.line, error.from.ch),
                  to: (window as any).CodeMirror.Pos(error.to.line, error.to.ch),
                  message: error.message,
                  severity: error.severity
                }));
              },
              async: false
            }
          });

          cm.setValue(code);
          
          cm.on('change', (instance: any) => {
            const newCode = instance.getValue();
            setCode(newCode);
            onCodeChange?.(newCode);
            
            // Update errors
            const newErrors = checkLuaSyntax(newCode);
            setErrors(newErrors);
          });

          cmInstanceRef.current = cm;
          
          // Initial syntax check
          const initialErrors = checkLuaSyntax(code);
          setErrors(initialErrors);
        }
      } catch (error) {
        console.error('Failed to load CodeMirror:', error);
        // Fallback to basic syntax checking without CodeMirror
        const initialErrors = checkLuaSyntax(code);
        setErrors(initialErrors);
      }
    };

    initializeCodeMirror();

    return () => {
      if (cmInstanceRef.current) {
        cmInstanceRef.current.toTextArea();
      }
    };
  }, []);

  useEffect(() => {
    if (cmInstanceRef.current) {
      cmInstanceRef.current.setOption('theme', theme);
    }
  }, [theme]);

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = event.target.value;
    setCode(newCode);
    onCodeChange?.(newCode);
    
    // Update errors if CodeMirror is not available
    if (!cmInstanceRef.current) {
      const newErrors = checkLuaSyntax(newCode);
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">
                Theme:
              </label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">Default</option>
                <option value="material">Material</option>
                <option value="monokai">Monokai</option>
                <option value="dracula">Dracula</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              {errorCount === 0 ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">No errors</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {errorCount} error{errorCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <label className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload</span>
              <input
                type="file"
                accept=".lua,.txt"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t border-gray-200 mt-3">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'editor'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code Editor</span>
          </button>
          
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 relative ${
              activeTab === 'issues'
                ? 'border-red-500 text-red-600 bg-red-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Issues</span>
            {errorCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {errorCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="relative min-h-96">
        {/* Editor Tab */}
        <div className={`transition-all duration-300 ${
          activeTab === 'editor' 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-4 absolute inset-0 pointer-events-none'
        }`}>
          <textarea
            ref={editorRef}
            value={code}
            onChange={handleCodeChange}
            className="w-full h-96 p-4 font-mono text-sm border-none resize-none focus:outline-none bg-white"
            placeholder="Enter your Lua code here..."
            style={{ display: cmInstanceRef.current ? 'none' : 'block' }}
          />
        </div>
        
        {/* Issues Tab */}
        <div className={`transition-all duration-300 ${
          activeTab === 'issues' 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-4 absolute inset-0 pointer-events-none'
        }`}>
          <div className="h-96 overflow-y-auto">
            {errors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found!</h3>
                <p className="text-sm text-center max-w-md">
                  Your Lua code looks great! No syntax errors or warnings detected.
                </p>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Issues Found ({errorCount})
                  </h3>
                  <button
                    onClick={() => setActiveTab('editor')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Back to Editor →
                  </button>
                </div>
                
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className={`group flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md ${
                        error.severity === 'error' 
                          ? 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200' 
                          : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200'
                      }`}
                      onClick={() => {
                        if (cmInstanceRef.current) {
                          // Switch back to editor tab
                          setActiveTab('editor');
                          // Small delay to ensure tab transition completes
                          setTimeout(() => {
                            // Focus the editor
                            cmInstanceRef.current.focus();
                            // Jump to the error line and column
                            cmInstanceRef.current.setCursor(error.from.line, error.from.ch);
                            // Center the line in the viewport
                            cmInstanceRef.current.scrollIntoView({line: error.from.line, ch: error.from.ch}, 100);
                            // Optionally select the problematic text if it has a range
                            if (error.to && (error.from.line !== error.to.line || error.from.ch !== error.to.ch)) {
                              cmInstanceRef.current.setSelection(error.from, error.to);
                            }
                          }, 150);
                        }
                      }}
                      title="Click to jump to this error"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        error.severity === 'error' ? 'bg-red-200' : 'bg-yellow-200'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">
                            Line {error.from.line + 1}, Column {error.from.ch + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            error.severity === 'error' 
                              ? 'bg-red-200 text-red-800' 
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {error.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {error.message}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
                          Click to fix
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
