import React from 'react';
import { Header } from './components/Header';
import CodeEditor from './components/CodeEditor';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

function App() {
  const handleCodeChange = (code: string) => {
    // Handle code changes if needed
    console.log('Code changed:', code.length, 'characters');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Professional Lua Syntax Checker
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Validate your Lua code with real-time syntax checking, comprehensive error detection, 
                and professional-grade development tools. Built for developers who demand excellence.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Real-time validation</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Sublime Text keybindings</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Multiple themes</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Editor Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Try the Lua Syntax Checker
              </h2>
              <p className="text-gray-600">
                Start typing or paste your Lua code below. The editor will provide real-time 
                syntax validation and highlight any errors or issues.
              </p>
            </div>
            
            <CodeEditor onCodeChange={handleCodeChange} />
            
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💡 Pro Tips
              </h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Use <kbd className="bg-blue-200 px-1 rounded">Ctrl+D</kbd> to select the next occurrence of the current word</li>
                <li>• Press <kbd className="bg-blue-200 px-1 rounded">Ctrl+/</kbd> to toggle line comments</li>
                <li>• Use <kbd className="bg-blue-200 px-1 rounded">Ctrl+L</kbd> to select the entire line</li>
                <li>• Press <kbd className="bg-blue-200 px-1 rounded">F3</kbd> to find the next occurrence of selected text</li>
              </ul>
            </div>
          </div>
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  );
}

export default App;
