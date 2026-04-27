import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Lock, Unlock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export default function EndpointCard({ endpoint }) {
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'POST': return 'bg-green-100 text-green-800 border-green-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

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
    <div id={endpoint.id} className="pt-20 -mt-20 mb-12 scroll-mt-20">
      <h3 className="text-xl font-bold text-slate-900 mb-2">{endpoint.title}</h3>
      <p className="text-slate-600 mb-6">{endpoint.description}</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Details */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-sm">
            <span className={`px-2 py-1 rounded border font-bold ${getMethodColor(endpoint.method)}`}>
              {endpoint.method}
            </span>
            <span className="text-slate-800 break-all">{endpoint.path}</span>
          </div>

          <div className="flex items-center gap-2">
            {endpoint.authRequired ? (
              <Badge variant="outline" className="flex items-center gap-1 text-slate-600 border-slate-300">
                <Lock className="w-3 h-3" /> Auth Required
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-slate-500 border-slate-200">
                <Unlock className="w-3 h-3" /> No Auth
              </Badge>
            )}
          </div>

          {endpoint.body && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Request Body</h4>
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <SyntaxHighlighter 
                  language="json" 
                  style={vscDarkPlus} 
                  customStyle={{ margin: 0, padding: '1rem', background: '#0f172a', fontSize: '0.875rem' }}
                >
                  {endpoint.body}
                </SyntaxHighlighter>
              </Card>
            </div>
          )}
        </div>

        {/* Right Side: Examples */}
        <div className="flex-1 space-y-6">
          {/* Example Request (cURL) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Example Request</h4>
              <button 
                onClick={() => handleCopy(endpoint.curl, 'curl')}
                className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-medium transition-colors"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedCurl ? 'Copied' : 'Copy'}
              </button>
            </div>
            <Card className="overflow-hidden border-slate-800 shadow-sm">
              <SyntaxHighlighter 
                language="bash" 
                style={vscDarkPlus} 
                customStyle={{ margin: 0, padding: '1rem', background: '#020817', fontSize: '0.875rem' }}
              >
                {endpoint.curl}
              </SyntaxHighlighter>
            </Card>
          </div>

          {/* Example Response */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Example Response</h4>
              <button 
                onClick={() => handleCopy(endpoint.response, 'response')}
                className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-medium transition-colors"
              >
                {copiedResponse ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedResponse ? 'Copied' : 'Copy'}
              </button>
            </div>
            <Card className="overflow-hidden border-slate-800 shadow-sm">
              <SyntaxHighlighter 
                language="json" 
                style={vscDarkPlus} 
                customStyle={{ margin: 0, padding: '1rem', background: '#0f172a', fontSize: '0.875rem' }}
              >
                {endpoint.response}
              </SyntaxHighlighter>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="h-px bg-slate-200 mt-12"></div>
    </div>
  );
}
