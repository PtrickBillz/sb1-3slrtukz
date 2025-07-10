import React, { useState } from 'react';
import { Clock, Trophy, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Task } from '../types';

export const Taskboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'completed'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofText, setProofText] = useState('');

  const tasks: Task[] = [
    {
      id: '1',
      project: 'DeFi Protocol',
      title: 'Analyze new yield farming opportunity',
      description: 'Research and provide analysis on the new liquidity mining program',
      reward: 150,
      deadline: new Date('2024-01-15'),
      status: 'available',
      type: 'analysis',
    },
    {
      id: '2',
      project: 'NFT Collection',
      title: 'Social media promotion',
      description: 'Create and share promotional content across social platforms',
      reward: 75,
      deadline: new Date('2024-01-12'),
      status: 'accepted',
      type: 'shill',
    },
    {
      id: '3',
      project: 'Web3 Platform',
      title: 'Community engagement',
      description: 'Participate in Discord discussions and help onboard new users',
      reward: 50,
      deadline: new Date('2024-01-10'),
      status: 'completed',
      type: 'engagement',
    },
  ];

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'my') return task.status === 'accepted' || task.status === 'pending';
    if (activeTab === 'completed') return task.status === 'completed';
    return true;
  });

  const handleAcceptTask = (task: Task) => {
    setSelectedTask(task);
    // Handle task acceptance logic
  };

  const handleSubmitProof = () => {
    if (selectedTask && proofText.trim()) {
      // Handle proof submission
      setShowProofModal(false);
      setProofText('');
      setSelectedTask(null);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'analysis':
        return <Trophy className="text-purple-600" size={20} />;
      case 'shill':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'engagement':
        return <Calendar className="text-blue-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Taskboard</h1>
        <p className="text-gray-600">Complete tasks and earn XP rewards</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'my', label: 'My Tasks' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(task.type)}
                  <span className="text-sm font-medium text-gray-600">{task.project}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              
              <h3 className="font-semibold mb-2">{task.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Trophy className="text-yellow-500" size={16} />
                  <span className="text-sm font-medium">{task.reward} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="text-gray-500" size={16} />
                  <span className="text-sm text-gray-500">
                    {task.deadline.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {task.status === 'available' && (
                  <Button
                    size="sm"
                    onClick={() => handleAcceptTask(task)}
                    className="flex-1"
                  >
                    Accept
                  </Button>
                )}
                {task.status === 'accepted' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowProofModal(true);
                    }}
                    className="flex-1"
                  >
                    Submit Proof
                  </Button>
                )}
                {task.status === 'completed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled
                    className="flex-1"
                  >
                    Completed
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Proof Modal */}
      <Modal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        title="Submit Proof of Completion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Provide evidence that you've completed the task: "{selectedTask?.title}"
          </p>
          <Input
            label="Proof Description"
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            placeholder="Describe what you did or provide links to your work..."
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmitProof} className="flex-1">
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowProofModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};