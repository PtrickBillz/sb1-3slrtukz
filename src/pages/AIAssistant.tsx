import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, Trash2, MessageSquare, AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAIChat } from '../hooks/useAIChat';
import { supabase } from '../lib/supabase';

export const AIAssistant: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [tablesExist, setTablesExist] = useState(false);
  const [checkingTables, setCheckingTables] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    sessions,
    currentSession,
    messages,
    loading,
    error,
    sendMessage,
    createNewSession,
    deleteSession,
    switchSession,
  } = useAIChat();

  const quickPrompts = [
    'Analyze my wallet for risks',
    'Best DeFi yield strategies',
    'How to avoid rugpulls',
    'Explain liquidity mining',
    'Token analysis checklist',
    'DeFi security tips',
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if database tables exist
  useEffect(() => {
    const checkTables = async () => {
      if (!isAuthenticated) {
        setCheckingTables(false);
        return;
      }

      try {
        setCheckingTables(true);
        const { error } = await supabase
          .from('chat_sessions')
          .select('count', { count: 'exact', head: true });

        if (error) {
          if (error.code === '42P01') {
            setTablesExist(false);
          } else {
            throw error;
          }
        } else {
          setTablesExist(true);
        }
      } catch (error) {
        console.error('Table check error:', error);
        setTablesExist(false);
      } finally {
        setCheckingTables(false);
      }
    };

    checkTables();
  }, [isAuthenticated]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading || !tablesExist) return;

    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (tablesExist) {
      setInputMessage(prompt);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat session?')) {
      await deleteSession(sessionId);
    }
  };

  // Show loading state
  if (authLoading || checkingTables) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center p-8">
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to use the AI Assistant</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Show database setup required message
  if (!tablesExist) {
    return (
      <div className="h-full bg-white rounded-lg shadow-sm p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Database Setup Required
              </h3>
              <p className="text-amber-700 mb-4">
                The AI Assistant requires database tables that haven't been created yet. Follow these steps to set up your database:
              </p>
              
              <div className="space-y-3">
                <div className="bg-white rounded-md p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Step 1: Open Supabase Dashboard
                  </h4>
                  <p className="text-sm text-amber-700 mb-2">
                    Go to your Supabase project dashboard and navigate to the SQL Editor.
                  </p>
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-amber-600 hover:text-amber-800 underline"
                  >
                    Open Supabase Dashboard <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>

                <div className="bg-white rounded-md p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">
                    Step 2: Run Migration SQL
                  </h4>
                  <p className="text-sm text-amber-700 mb-2">
                    Copy and paste the SQL from this migration file in your project:
                  </p>
                  <code className="text-xs bg-amber-100 px-2 py-1 rounded text-amber-800 block">
                    supabase/migrations/20250713021608_bitter_spark.sql
                  </code>
                </div>

                <div className="bg-white rounded-md p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">
                    Step 3: Refresh Page
                  </h4>
                  <p className="text-sm text-amber-700 mb-2">
                    After running the SQL, refresh this page to access the AI Assistant.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Sidebar - Chat Sessions */}
      <div className="w-80 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Chat Sessions</h2>
            <Button
              size="sm"
              onClick={() => createNewSession()}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              New
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => switchSession(session)}
              className={`p-3 rounded-lg cursor-pointer mb-2 group hover:bg-white transition-colors ${
                currentSession?.id === session.id
                  ? 'bg-white shadow-sm border border-blue-200'
                  : 'hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare size={16} className="text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Database Assistant</h1>
              <p className="text-sm text-gray-600">
                {currentSession ? currentSession.title : 'Chat with your data'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        {messages.length === 0 && (
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">Try these prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Start a conversation with your AI assistant</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="text-white" size={16} />
                ) : (
                  <Bot className="text-white" size={16} />
                )}
              </div>
              
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your data..."
              className="flex-1"
              disabled={loading || !tablesExist}
            />
            <Button type="submit" disabled={!inputMessage.trim() || loading || !tablesExist}>
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};