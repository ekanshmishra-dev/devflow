import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { Loader2, Plus, CheckSquare } from 'lucide-react';

export default function TasksView() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'medium',
    status: 'todo'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks').catch(() => ({ data: { data: [] } })),
        api.get('/projects').catch(() => ({ data: { data: [] } }))
      ]);
      setTasks(tasksRes.data.data || tasksRes.data || []);
      setProjects(projectsRes.data.data || projectsRes.data || []);
      
      // Auto-select first project if available
      if (projectsRes.data?.data?.length > 0 && !formData.project) {
        setFormData(prev => ({ ...prev, project: projectsRes.data.data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    setCreating(true);
    try {
      const res = await api.post('/tasks', formData);
      if (res.data && res.data.data) {
        setTasks([res.data.data, ...tasks]);
      } else {
        fetchData();
      }
      setFormData({ ...formData, title: '', description: '' }); // keep project, priority, status
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'todo': return <Badge variant="secondary">To Do</Badge>;
      case 'in-progress': return <Badge className="bg-blue-500 text-white hover:bg-blue-600">In Progress</Badge>;
      case 'review': return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Review</Badge>;
      case 'done': return <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Done</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <p className="text-slate-500">Manage and prioritize your work items.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Task Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Task</CardTitle>
              <CardDescription>Create a new task in a project.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Implement Login API"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Details about the task..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <select 
                    id="project"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                    value={formData.project}
                    onChange={(e) => setFormData({...formData, project: e.target.value})}
                  >
                    <option value="">Select a project...</option>
                    {projects.map(p => (
                      <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select 
                      id="priority"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create Task
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <div className="md:col-span-2 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <CheckSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No tasks yet</h3>
              <p className="text-slate-500">Create your first task to track progress.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => (
                <Card key={task._id || task.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={task.priority || 'low'} className="uppercase px-1.5 py-0 text-[10px]">
                          {task.priority || 'low'}
                        </Badge>
                        <h4 className="font-semibold text-slate-900 truncate">{task.title}</h4>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{task.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-500">Project</p>
                        <p className="text-sm font-medium truncate max-w-[120px]">
                          {task.project?.name || 'Unassigned'}
                        </p>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
