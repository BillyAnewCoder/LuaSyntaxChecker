import React from 'react';
import { 
  Zap, 
  Shield, 
  Code, 
  Download, 
  Palette, 
  Search,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-time Validation',
      description: 'Get instant feedback as you type with live syntax checking and error highlighting.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Comprehensive Error Detection',
      description: 'Detects syntax errors, bracket mismatches, unclosed blocks, and common Lua mistakes.'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Sublime Text Keybindings',
      description: 'Familiar keyboard shortcuts and editing experience with Sublime Text key mappings.'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Multiple Themes',
      description: 'Choose from various editor themes including Material, Monokai, and Dracula.'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Import & Export',
      description: 'Upload Lua files for validation or download your code with a single click.'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Advanced Editor Features',
      description: 'Line numbers, bracket matching, auto-completion, and intelligent indentation.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Professional Lua Development Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to write, validate, and debug Lua code efficiently. 
            Built for developers who demand quality and precision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Status indicators */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Syntax Valid</p>
                <p className="text-sm text-green-700">No errors detected in your code</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Syntax Errors</p>
                <p className="text-sm text-red-700">Issues found that need attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
