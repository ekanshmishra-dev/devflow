import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowLeft, Terminal, Server, Sparkles } from 'lucide-react';
import { apiDocs } from '../data/apiDocs';
import EndpointCard from '../components/docs/EndpointCard';
import AIFeatureCard from '../components/docs/AIFeatureCard';
import { Badge } from '../components/ui/Badge';

export default function ApiDocsView() {
  const [activeId, setActiveId] = useState('');

  // Simple intersection observer to highlight active sidebar link
  useEffect(() => {
    const handleScroll = () => {
      const headings = Array.from(document.querySelectorAll('div[id]'));
      const scrollPosition = window.scrollY + 100;
      
      let currentActiveId = '';
      headings.forEach((heading) => {
        if (heading.offsetTop <= scrollPosition) {
          currentActiveId = heading.id;
        }
      });
      if (currentActiveId) setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to App
              </Link>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 p-1.5 rounded-md">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">DevFlow API Reference</span>
                <Badge variant="secondary" className="ml-2">v1.0</Badge>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-slate-500">Base URL:</span>
              <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono border border-slate-200">
                http://localhost:5000
              </code>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 pt-10 pb-16 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-6 border-r border-slate-200">
          <nav className="space-y-8">
            {apiDocs.map((group) => (
              <div key={group.id}>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  {group.isAi ? <Sparkles className="w-4 h-4 text-indigo-500" /> : <Server className="w-4 h-4 text-slate-400" />}
                  {group.group}
                </h4>
                <ul className="space-y-2 border-l border-slate-100 ml-2">
                  {group.endpoints.map((endpoint) => (
                    <li key={endpoint.id}>
                      <button
                        onClick={() => scrollTo(endpoint.id)}
                        className={`text-sm block pl-4 py-1 border-l -ml-[1px] transition-colors w-full text-left
                          \${activeId === endpoint.id 
                            ? group.isAi 
                              ? 'border-indigo-500 text-indigo-600 font-medium' 
                              : 'border-slate-900 text-slate-900 font-medium'
                            : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                          }
                        `}
                      >
                        {endpoint.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-4xl pt-10 pb-24 lg:pl-16">
          <div className="mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">API Documentation</h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Welcome to the DevFlow API reference. Here you'll find everything you need to authenticate, manage projects, manipulate tasks, and leverage our powerful AI tools programmatically.
            </p>
          </div>

          {apiDocs.map((group) => (
            <div key={group.id} className="mb-12">
              <h2 className="text-2xl font-bold border-b border-slate-200 pb-2 mb-8 flex items-center gap-2">
                {group.group}
                {group.isAi && <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 ml-2">Premium</Badge>}
              </h2>
              
              <div className="space-y-16">
                {group.endpoints.map((endpoint) => (
                  group.isAi ? (
                    <AIFeatureCard key={endpoint.id} endpoint={endpoint} />
                  ) : (
                    <EndpointCard key={endpoint.id} endpoint={endpoint} />
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
