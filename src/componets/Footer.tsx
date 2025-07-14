import React from 'react';
import { Code2, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Lua Syntax Checker</h3>
                <p className="text-gray-400 text-sm">Professional code validation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A professional-grade Lua syntax checker built for developers. 
              Validate your code with real-time error detection and comprehensive analysis.
            </p>
            <div className="flex items-center space-x-1 text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the Lua community</span>
            </div>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.lua.org/manual/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>Lua Manual</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.lua.org/pil/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>Programming in Lua</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://luarocks.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>LuaRocks</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://codemirror.net/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white flex items-center space-x-1 transition-colors"
                >
                  <span>CodeMirror</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Real-time validation</li>
              <li>Syntax highlighting</li>
              <li>Error detection</li>
              <li>Multiple themes</li>
              <li>File import/export</li>
              <li>Sublime keybindings</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Lua Syntax Checker. Built with modern web technologies.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="text-gray-400 text-sm">Powered by CodeMirror</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
