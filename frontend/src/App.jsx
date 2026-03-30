import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CodeForm from './components/CodeForm';
import ResultsDisplay from './components/ResultsDisplay';
import FeatureHighlights from './components/FeatureHighlights';
import Auth from './components/Auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('converter');

  const handleAuthSuccess = (name) => {
    setIsAuthenticated(true);
    setUserName(name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setActiveTab('converter');
  };

  const handleConversion = async (formData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResults({
        convertedCode: `// Converted to ${formData.targetLanguage}
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const person = "World";
greet(person);`,
        targetLanguage: formData.targetLanguage,
        bugs: [
          {
            severity: 'Medium',
            type: 'Potential Null Reference',
            description: 'Parameter "name" might be undefined or null',
            line: 2,
            codeSnippet: 'function greet(name) {',
            suggestion: 'Add a null check: if (!name) throw new Error("Name is required");'
          }
        ],
        stats: {
          linesOfCode: 42,
          conversionTime: 523,
          accuracy: 94,
          bugsFound: 1
        },
        notes: [
          'Applied proper naming conventions for target language',
          'Optimized code structure for readability',
          'Added necessary type annotations where applicable'
        ]
      });
      setActiveTab('results');
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // If authenticated, show main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={userName}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Converter Tab */}
        {activeTab === 'converter' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <CodeForm onSubmit={handleConversion} loading={loading} />
            </div>
            <div>
              {results && <ResultsDisplay results={results} />}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && <FeatureHighlights />}
      </main>

      <Footer />
    </div>
  );
}
