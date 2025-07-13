import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { StatCard } from '../components/ui/StatCard';
import { XPProgress } from '../components/ui/XPProgress';
import { DatabaseStatus } from '../components/ui/DatabaseStatus';
import { supabase } from '../lib/supabase';
import { 
  TrendingUp, 
  Shield, 
  Brain, 
  Wallet,
  AlertTriangle,
  Database,
  ExternalLink
} from 'lucide-react';

interface DashboardStats {
  totalSessions: number;
  totalQueries: number;
  walletCount: number;
  xpPoints: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    totalQueries: 0,
    walletCount: 0,
    xpPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [tablesExist, setTablesExist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkTablesAndLoadStats();
  }, []);

  const checkTablesAndLoadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if tables exist by trying to query them
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('count', { count: 'exact', head: true });

      if (sessionsError) {
        if (sessionsError.code === '42P01') {
          // Table doesn't exist
          setTablesExist(false);
          setStats({
            totalSessions: 0,
            totalQueries: 0,
            walletCount: 0,
            xpPoints: 0
          });
          return;
        } else {
          throw sessionsError;
        }
      }

      setTablesExist(true);

      // Load actual stats if tables exist
      // Load session count
      const { count: sessionCount, error: sessionCountError } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true });

      if (sessionCountError && sessionCountError.code === '42P01') {
        setTablesExist(false);
        setStats({
          totalSessions: 0,
          totalQueries: 0,
          walletCount: 0,
          xpPoints: 0
        });
        return;
      }

      // Load query count
      const { count: queryCount, error: queryCountError } = await supabase
        .from('ai_queries')
        .select('*', { count: 'exact', head: true });

      if (queryCountError && queryCountError.code === '42P01') {
        setTablesExist(false);
        setStats({
          totalSessions: 0,
          totalQueries: 0,
          walletCount: 0,
          xpPoints: 0
        });
        return;
      }

      // Load user data
      const { data: userData, error: userDataError } = await supabase
        .from('user_data')
        .select('wallets')
        .single();

      if (userDataError && userDataError.code === '42P01') {
        setTablesExist(false);
        setStats({
          totalSessions: 0,
          totalQueries: 0,
          walletCount: 0,
          xpPoints: 0
        });
        return;
      }

      const walletCount = userData?.wallets ? JSON.parse(userData.wallets).length : 0;
      const xpPoints = (queryCount || 0) * 10 + (sessionCount || 0) * 25;

      setStats({
        totalSessions: sessionCount || 0,
        totalQueries: queryCount || 0,
        walletCount,
        xpPoints
      });

    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const MigrationInstructions = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Database Setup Required
          </h3>
          <p className="text-amber-700 mb-4">
            The database tables haven't been created yet. Follow these steps to set up your database:
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
                Copy and paste the SQL from the migration file in your project:
              </p>
              <code className="text-xs bg-amber-100 px-2 py-1 rounded text-amber-800">
                supabase/migrations/create_missing_tables.sql
              </code>
            </div>

            <div className="bg-white rounded-md p-4 border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">
                Step 3: Refresh Dashboard
              </h4>
              <p className="text-sm text-amber-700 mb-2">
                After running the SQL, refresh this page to see your dashboard data.
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
  );

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <DatabaseStatus />
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <DatabaseStatus />
        </div>

        {!tablesExist && <MigrationInstructions />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">Error: {error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Chat Sessions"
            value={stats.totalSessions}
            icon={Brain}
            color="indigo"
            description="AI conversations started"
          />
          <StatCard
            title="AI Queries"
            value={stats.totalQueries}
            icon={TrendingUp}
            color="green"
            description="Questions asked to AI"
          />
          <StatCard
            title="Tracked Wallets"
            value={stats.walletCount}
            icon={Wallet}
            color="purple"
            description="Wallets being monitored"
          />
          <StatCard
            title="Security Score"
            value={85}
            icon={Shield}
            color="emerald"
            description="Overall security rating"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">XP Progress</h2>
            <XPProgress currentXP={stats.xpPoints} />
            <div className="mt-4 text-sm text-gray-600">
              <p>Earn XP by:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Asking AI questions (+10 XP)</li>
                <li>Starting chat sessions (+25 XP)</li>
                <li>Adding wallet addresses (+15 XP)</li>
                <li>Completing security tasks (+50 XP)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {tablesExist ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">AI Assistant Ready</p>
                    <p className="text-xs text-gray-600">Start chatting to get personalized DeFi advice</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Wallet Tracker Available</p>
                    <p className="text-xs text-gray-600">Add wallet addresses to monitor</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Complete database setup to see activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}