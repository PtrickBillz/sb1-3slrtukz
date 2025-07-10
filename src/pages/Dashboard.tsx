import React from 'react';
import { CheckSquare, Wallet, Trophy, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { XPProgress } from '../components/ui/XPProgress';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Hey John, here's your agent toolkit</h1>
        <p className="text-blue-100">Ready to dominate DeFi with AI-powered insights</p>
      </div>

      {/* XP Progress */}
      <XPProgress currentXP={2450} nextLevelXP={3000} level={12} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tasks Completed"
          value={47}
          icon={CheckSquare}
          color="bg-green-500"
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Wallets Tracked"
          value={12}
          icon={Wallet}
          color="bg-blue-500"
          change={{ value: 3, type: 'increase' }}
        />
        <StatCard
          title="XP Earned"
          value="2,450"
          icon={Trophy}
          color="bg-purple-500"
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="Success Rate"
          value="94%"
          icon={TrendingUp}
          color="bg-cyan-500"
          change={{ value: 2, type: 'increase' }}
        />
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Latest Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Completed task', project: 'DeFi Protocol Analysis', time: '2 hours ago', xp: 50 },
            { action: 'Wallet analyzed', project: '0x1234...5678', time: '4 hours ago', xp: 25 },
            { action: 'Module completed', project: 'Web3 Security Basics', time: '1 day ago', xp: 100 },
            { action: 'Task accepted', project: 'Token Shill Campaign', time: '2 days ago', xp: 0 },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.project}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              {activity.xp > 0 && (
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  +{activity.xp} XP
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};