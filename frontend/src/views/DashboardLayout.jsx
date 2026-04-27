import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, FolderKanban, CheckSquare, Sparkles, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Placeholder imports for views we will build next
import ProjectsView from './ProjectsView';
import TasksView from './TasksView';
import AIFeaturesView from './AIFeaturesView';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'ai', label: 'AI Features', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                DevFlow
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-slate-900">{user?.name}</p>
                <p className="text-slate-500">{user?.role || 'User'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase border border-slate-200">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                <LogOut className="w-5 h-5 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? tab.id === 'ai' 
                      ? 'border-indigo-500 text-indigo-600' 
                      : 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id && tab.id === 'ai' ? 'text-indigo-500' : ''}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'ai' && <AIFeaturesView />}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
            <User className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
            <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
              Role: {user?.role || 'User'}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
