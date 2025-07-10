import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkConnection();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session) {
        setStatus('connected');
      } else {
        checkConnection();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        setStatus('connected');
      } else {
        // Test basic connection
        const { error } = await supabase.from('chat_sessions').select('count').limit(1);
        setStatus(error ? 'error' : 'connected');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'error':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-yellow-500" size={16} />;
    }
  };

  const getStatusText = () => {
    if (user) {
      return `Connected as ${user.email}`;
    }
    
    switch (status) {
      case 'connected':
        return 'Database connected';
      case 'error':
        return 'Connection error';
      default:
        return 'Checking connection...';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Database size={16} className="text-gray-500" />
      {getStatusIcon()}
      <span className={`${
        status === 'connected' ? 'text-green-600' : 
        status === 'error' ? 'text-red-600' : 'text-yellow-600'
      }`}>
        {getStatusText()}
      </span>
    </div>
  );
};