import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { Loader2, Sparkles, Code2, ListTree, Zap, FileText, Search, CheckCircle } from 'lucide-react';

export default function AIFeaturesView() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // States for Card A: Subtask Generator
  const [subtaskTaskId, setSubtaskTaskId] = useState('');
  const [subtasksLoading, setSubtasksLoading] = useState(false);
  const [subtasksResult, setSubtasksResult] = useState(null);

  // States for Card B: Code Review
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [codeReviewLoading, setCodeReviewLoading] = useState(false);
  const [codeReviewResult, setCodeReviewResult] = useState(null);

  // States for Card C: Priority Predictor
  const [priorityTaskId, setPriorityTaskId] = useState('');
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [priorityResult, setPriorityResult] = useState(null);

  // States for Card D: Meeting Notes
  const [notes, setNotes] = useState('');
  const [notesProjectId, setNotesProjectId] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesResult, setNotesResult] = useState(null);

  // States for Card E: Smart Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Fetch dropdown data
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks').catch(() => ({ data: { data: [] } })),
          api.get('/projects').catch(() => ({ data: { data: [] } }))
        ]);
        setTasks(tasksRes.data.data || tasksRes.data || []);
        setProjects(projectsRes.data.data || projectsRes.data || []);
      } catch (e) {
        console.error("Failed to load dropdown data");
      }
    };
    fetchData();
  }, []);

  const handleGenerateSubtasks = async () => {
    if (!subtaskTaskId) return;
    setSubtasksLoading(true);
    setSubtasksResult(null);
    try {
      const res = await api.post(`/ai/tasks/${subtaskTaskId}/generate-subtasks`);
      setSubtasksResult(res.data.data || res.data.subtasks || res.data);
    } catch (e) {
      setSubtasksResult({ error: e.response?.data?.message || 'Failed to generate subtasks' });
    } finally {
      setSubtasksLoading(false);
    }
  };

  const handleCodeReview = async () => {
    if (!code) return;
    setCodeReviewLoading(true);
    setCodeReviewResult(null);
    try {
      const res = await api.post('/ai/code/analyze', { code, language });
      setCodeReviewResult(res.data.data || res.data.analysis || res.data);
    } catch (e) {
      setCodeReviewResult({ error: e.response?.data?.message || 'Failed to analyze code' });
    } finally {
      setCodeReviewLoading(false);
    }
  };

  const handlePredictPriority = async () => {
    if (!priorityTaskId) return;
    setPriorityLoading(true);
    setPriorityResult(null);
    try {
      const res = await api.post(`/ai/tasks/${priorityTaskId}/suggest-priority`);
      setPriorityResult(res.data.data || res.data.suggestion || res.data);
    } catch (e) {
      setPriorityResult({ error: e.response?.data?.message || 'Failed to predict priority' });
    } finally {
      setPriorityLoading(false);
    }
  };

  const handleParseNotes = async () => {
    if (!notes) return;
    setNotesLoading(true);
    setNotesResult(null);
    try {
      const payload = { notes };
      if (notesProjectId) payload.projectId = notesProjectId;
      const res = await api.post('/ai/meeting-notes/parse', payload);
      setNotesResult(res.data);
    } catch (e) {
      setNotesResult({ error: e.response?.data?.message || 'Failed to parse notes' });
    } finally {
      setNotesLoading(false);
    }
  };

  const handleSmartSearch = async () => {
    if (!searchQuery) return;
    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await api.get(`/ai/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResult(res.data.data || res.data.results || res.data);
    } catch (e) {
      setSearchResult({ error: e.response?.data?.message || 'Failed to search' });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <h2 className="text-3xl font-bold tracking-tight">AI Intelligence Hub</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl text-lg">
          Supercharge your workflow with Claude AI. Generate subtasks, analyze code, and predict priorities automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card A: Subtask Generator */}
        <Card className="border-indigo-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTree className="w-5 h-5 text-indigo-600" />
              Subtask Generator
            </CardTitle>
            <CardDescription>Automatically break down complex tasks into actionable steps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Parent Task</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                value={subtaskTaskId}
                onChange={e => setSubtaskTaskId(e.target.value)}
              >
                <option value="">Select a task...</option>
                {tasks.map(t => <option key={t._id||t.id} value={t._id||t.id}>{t.title}</option>)}
              </select>
            </div>
            <Button variant="gradient" className="w-full" onClick={handleGenerateSubtasks} disabled={subtasksLoading || !subtaskTaskId}>
              {subtasksLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Subtasks
            </Button>
            
            {subtasksResult && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                {subtasksResult.error ? (
                  <p className="text-sm text-red-500">{subtasksResult.error}</p>
                ) : (
                  <ul className="space-y-2">
                    {Array.isArray(subtasksResult) ? subtasksResult.map((st, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{st.title || st}</span>
                      </li>
                    )) : <pre className="text-xs overflow-auto">{JSON.stringify(subtasksResult, null, 2)}</pre>}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card B: Code Review */}
        <Card className="border-blue-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              Smart Code Review
            </CardTitle>
            <CardDescription>Get instant AI feedback on your code snippets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label>Language</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Code Snippet</Label>
              <textarea 
                className="flex min-h-[120px] font-mono w-full rounded-md border border-slate-200 bg-slate-900 text-slate-50 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                placeholder="function hello() { return 'world'; }"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCodeReview} disabled={codeReviewLoading || !code}>
              {codeReviewLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code2 className="mr-2 h-4 w-4" />}
              Analyze Code
            </Button>
            
            {codeReviewResult && (
              <div className="mt-4 space-y-3">
                {codeReviewResult.error ? (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{codeReviewResult.error}</p>
                ) : (
                  <>
                    {codeReviewResult.score && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">Quality Score:</span>
                        <Badge className={`text-lg px-3 py-1 ${codeReviewResult.score > 7 ? 'bg-emerald-500' : codeReviewResult.score > 4 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          {codeReviewResult.score}/10
                        </Badge>
                      </div>
                    )}
                    {codeReviewResult.issues?.length > 0 && (
                      <div className="bg-red-50 p-3 rounded-md border border-red-100">
                        <h4 className="text-xs font-bold text-red-800 uppercase mb-1">Issues</h4>
                        <ul className="text-sm text-red-700 list-disc pl-4">
                          {codeReviewResult.issues.map((iss, i) => <li key={i}>{iss}</li>)}
                        </ul>
                      </div>
                    )}
                    {codeReviewResult.suggestions?.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Suggestions</h4>
                        <ul className="text-sm text-blue-700 list-disc pl-4">
                          {codeReviewResult.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card C: Priority Predictor */}
        <Card className="border-orange-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-rose-400"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Priority Predictor
            </CardTitle>
            <CardDescription>Let AI calculate the priority and estimated time for a task.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Task</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                value={priorityTaskId}
                onChange={e => setPriorityTaskId(e.target.value)}
              >
                <option value="">Select a task...</option>
                {tasks.map(t => <option key={t._id||t.id} value={t._id||t.id}>{t.title}</option>)}
              </select>
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handlePredictPriority} disabled={priorityLoading || !priorityTaskId}>
              {priorityLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Predict Priority
            </Button>
            
            {priorityResult && (
              <div className="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-100">
                {priorityResult.error ? (
                  <p className="text-sm text-red-500">{priorityResult.error}</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Suggested Priority:</span>
                      <Badge variant={priorityResult.priority?.toLowerCase() || 'medium'} className="uppercase">
                        {priorityResult.priority || 'Unknown'}
                      </Badge>
                    </div>
                    {priorityResult.estimatedHours && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Estimated Time:</span>
                        <span className="text-sm font-bold text-slate-900">{priorityResult.estimatedHours} hours</span>
                      </div>
                    )}
                    {priorityResult.reasoning && (
                      <div className="mt-2 text-sm text-slate-600 bg-white p-2 rounded border border-orange-100">
                        <strong>Reasoning:</strong> {priorityResult.reasoning}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card D: Meeting Notes Parser */}
        <Card className="border-emerald-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Meeting Notes Parser
            </CardTitle>
            <CardDescription>Extract actionable tasks from rough meeting transcripts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Target Project (Optional)</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={notesProjectId}
                onChange={e => setNotesProjectId(e.target.value)}
              >
                <option value="">No Project / Unassigned</option>
                {projects.map(p => <option key={p._id||p.id} value={p._id||p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Meeting Notes</Label>
              <textarea 
                className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                placeholder="Paste the zoom transcript or notes here..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleParseNotes} disabled={notesLoading || !notes}>
              {notesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Extract Tasks
            </Button>
            
            {notesResult && (
              <div className="mt-4">
                {notesResult.error ? (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{notesResult.error}</p>
                ) : (
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <p className="text-sm font-medium text-emerald-800 mb-2">
                      Extracted {notesResult.extractedTasksCount || notesResult.tasks?.length || 0} tasks
                    </p>
                    <ul className="space-y-2">
                      {(notesResult.tasks || []).map((t, i) => (
                        <li key={i} className="bg-white p-2 rounded text-sm shadow-sm border border-emerald-100 flex justify-between items-center">
                          <span className="font-medium">{t.title}</span>
                          {t.dueDate && <span className="text-xs text-slate-500 ml-2">Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card E: Smart Search */}
        <Card className="lg:col-span-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-gradient-to-br from-white to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-700" />
              Smart Semantic Search
            </CardTitle>
            <CardDescription>Search across all tasks using natural language.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                className="flex-1 border-slate-300"
                placeholder="e.g., show me all high priority tasks that are in progress"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSmartSearch()}
              />
              <Button onClick={handleSmartSearch} disabled={searchLoading || !searchQuery} className="bg-slate-800 hover:bg-slate-900 text-white px-8">
                {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
            
            {searchResult && (
              <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {searchResult.error ? (
                  <p className="text-sm text-red-500 p-4">{searchResult.error}</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {Array.isArray(searchResult) && searchResult.length > 0 ? (
                      searchResult.map((res, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                          <div>
                            <h4 className="font-medium text-sm text-slate-900">{res.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{res.description}</p>
                          </div>
                          <Badge variant="outline">{res.status || 'unknown'}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 p-4 text-center">No results found for your query.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
