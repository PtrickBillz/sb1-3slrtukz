import React, { useState } from 'react';
import { BookOpen, Trophy, CheckCircle, Clock, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LearningModule } from '../types';

export const LearnEarn: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>([
    {
      id: '1',
      title: 'Intro to Web3 Agents',
      description: 'Learn the basics of autonomous agents in the Web3 ecosystem',
      xpReward: 100,
      completed: true,
      duration: '30 min',
      difficulty: 'beginner',
    },
    {
      id: '2',
      title: 'DeFi Risk Assessment',
      description: 'Master the art of identifying and mitigating DeFi risks',
      xpReward: 150,
      completed: false,
      duration: '45 min',
      difficulty: 'intermediate',
    },
    {
      id: '3',
      title: 'Advanced Token Analysis',
      description: 'Deep dive into tokenomics and market analysis techniques',
      xpReward: 200,
      completed: false,
      duration: '60 min',
      difficulty: 'advanced',
    },
    {
      id: '4',
      title: 'Avoiding Rugpulls',
      description: 'Essential strategies to protect yourself from scam projects',
      xpReward: 75,
      completed: false,
      duration: '25 min',
      difficulty: 'beginner',
    },
    {
      id: '5',
      title: 'Yield Farming Strategies',
      description: 'Optimize your returns with proven yield farming techniques',
      xpReward: 175,
      completed: false,
      duration: '50 min',
      difficulty: 'intermediate',
    },
  ]);

  const totalXP = modules.reduce((sum, module) => sum + (module.completed ? module.xpReward : 0), 0);
  const completedModules = modules.filter(module => module.completed).length;
  const progressPercentage = (completedModules / modules.length) * 100;

  const getDifficultyColor = (difficulty: LearningModule['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty: LearningModule['difficulty']) => {
    const stars = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleStartModule = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, completed: true }
          : module
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Learn & Earn</h1>
        <p className="text-gray-600">Master Web3 skills and earn XP rewards</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{completedModules}</div>
            <div className="text-sm text-gray-600">Modules Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{totalXP}</div>
            <div className="text-sm text-gray-600">XP Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-600">{completedModules} / {modules.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Available Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <div className="flex items-center gap-1">
                  {getDifficultyStars(module.difficulty)}
                </div>
              </div>
              
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="text-blue-600" size={20} />
                {module.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Trophy className="text-yellow-500" size={16} />
                    <span className="text-sm font-medium">{module.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="text-gray-500" size={16} />
                    <span className="text-sm text-gray-500">{module.duration}</span>
                  </div>
                </div>
                
                {module.completed && (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
              
              <Button
                onClick={() => handleStartModule(module.id)}
                disabled={module.completed}
                className="w-full"
                variant={module.completed ? 'secondary' : 'primary'}
              >
                {module.completed ? 'Completed' : 'Start Module'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};