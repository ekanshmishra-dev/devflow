import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Lock, Sparkles, Bot } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export default function AIFeatureCard({ endpoint }) {
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'response') {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  return (
    <div id={endpoint.id} className="pt-20 -mt-20 mb-16 scroll-mt-20">
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative p-8 lg:p-10">
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              {endpoint.title}
            </h3>
          </div>

          <p className="text-slate-300 text-lg mb-4 max-w-3xl leading-relaxed">
            {endpoint.description}
          </p>
          
          <div className="mb-8 p-4 bg-indigo-950/40 rounded-lg border border-indigo-500/20">
            <p className="text-indigo-200 text-sm">
              <strong className="text-indigo-300 font-semibold uppercase tracking-wider text-xs mr-2">Use Case:</strong> 
              {endpoint.useCase}
            </p>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-8">
            
            {/* Left Side: Details */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl font-mono text-sm">
                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  {endpoint.method}
                </span>
                <span className="text-slate-300 break-all font-medium">{endpoint.path}</span>
              </div>

              <div className="flex items-center gap-2">
                {endpoint.authRequired && (
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Auth Required
                  </Badge>
                )}
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Claude 3.5 Sonnet
                </Badge>
              </div>

              {endpoint.body && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Request Body</h4>
                  <div className="rounded-xl overflow-hidden border border-slate-800">
                    <SyntaxHighlighter 
                      language="json" 
                      style={vscDarkPlus} 
                      customStyle={{ margin: 0, padding: '1.25rem', background: '#020617', fontSize: '0.875rem' }}
                    >
                      {endpoint.body}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Examples */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Example Request</h4>
                  <button 
                    onClick={() => handleCopy(endpoint.curl, 'curl')}
                    className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-xs font-medium transition-colors"
                  >
                    {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCurl ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800">
                  <SyntaxHighlighter 
                    language="bash" 
                    style={vscDarkPlus} 
                    customStyle={{ margin: 0, padding: '1.25rem', background: '#020617', fontSize: '0.875rem' }}
                  >
                    {endpoint.curl}
                  </SyntaxHighlighter>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Response</h4>
                  <button 
                    onClick={() => handleCopy(endpoint.response, 'response')}
                    className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-xs font-medium transition-colors"
                  >
                    {copiedResponse ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedResponse ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-indigo-500/30 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  <SyntaxHighlighter 
                    language="json" 
                    style={vscDarkPlus} 
                    customStyle={{ margin: 0, padding: '1.25rem', paddingTop: '1.5rem', background: '#0a0f24', fontSize: '0.875rem' }}
                  >
                    {endpoint.response}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
