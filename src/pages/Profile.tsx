import React from 'react';
import { User, Trophy, CheckSquare, Wallet, Calendar, Edit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { XPProgress } from '../components/ui/XPProgress';

export const Profile: React.FC = () => {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joinedAt: new Date('2023-10-01'),
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    avatar: '',
    stats: {
      tasksCompleted: 47,
      walletsTracked: 12,
      xpEarned: 2450,
      modulesCompleted: 8,
    },
    wallets: [
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321',
    ],
    recentActivity: [
      { date: '2024-01-08', action: 'Completed DeFi Analysis Task', xp: 150 },
      { date: '2024-01-07', action: 'Finished Learning Module', xp: 100 },
      { date: '2024-01-06', action: 'Added wallet to tracker', xp: 25 },
      { date: '2024-01-05', action: 'Completed engagement task', xp: 75 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {user.joinedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Edit size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
        
        <XPProgress currentXP={user.xp} nextLevelXP={user.nextLevelXp} level={user.level} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="text-green-500" size={24} />
            <h3 className="font-semibold">Tasks Completed</h3>
          </div>
          <p className="text-2xl font-bold">{user.stats.tasksCompleted}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-blue-500" size={24} />
            <h3 className="font-semibold">Wallets Tracked</h3>
          </div>
          <p className="text-2xl font-bold">{user.stats.walletsTracked}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-yellow-500" size={24} />
            <h3 className="font-semibold">XP Earned</h3>
          </div>
          <p className="text-2xl font-bold">{user.stats.xpEarned.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-purple-500" size={24} />
            <h3 className="font-semibold">Modules Completed</h3>
          </div>
          <p className="text-2xl font-bold">{user.stats.modulesCompleted}</p>
        </div>
      </div>

      {/* Connected Wallets */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Connected Wallets</h2>
          <Button variant="outline" size="sm">
            Add Wallet
          </Button>
        </div>
        
        <div className="space-y-3">
          {user.wallets.map((wallet, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Wallet className="text-blue-500" size={20} />
                <span className="font-mono text-sm">{wallet}</span>
              </div>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {user.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                +{activity.xp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};