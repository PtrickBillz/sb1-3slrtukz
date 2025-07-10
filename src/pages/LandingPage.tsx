import React, { useState } from 'react';
import { Bot, Shield, TrendingUp, Users, CheckCircle, Twitter, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Toast } from '../components/ui/Toast';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowToast(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toast
        message="Successfully joined the waitlist!"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {/* Header */}
      <header className="px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              AidAgent
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">Login</Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your AI Agent for <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">DeFi Growth</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track wallets, complete tasks, and grow with AI. The ultimate productivity platform for Web3 automation and DeFi success.
          </p>
          
          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="lg">Join Waitlist</Button>
          </form>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Connect Your AI Agent</h4>
              <p className="text-gray-600">Set up your personal AI assistant to analyze wallets, tokens, and market trends automatically.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Complete Tasks & Earn</h4>
              <p className="text-gray-600">Take on engagement tasks, learn new skills, and earn XP rewards to level up your profile.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Track & Optimize</h4>
              <p className="text-gray-600">Monitor your portfolio, track performance, and get AI-powered insights for better decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Benefits of Using AidAgent</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Risk Assessment</h4>
                <p className="text-gray-600">AI-powered analysis of wallets and tokens to identify potential risks and opportunities.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community Engagement</h4>
                <p className="text-gray-600">Connect with other Web3 enthusiasts and participate in collaborative tasks.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Automated Tracking</h4>
                <p className="text-gray-600">Set up automatic monitoring for your favorite wallets and tokens.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="text-cyan-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI-Powered Insights</h4>
                <p className="text-gray-600">Get personalized recommendations and market insights from advanced AI analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="text-white" size={14} />
            </div>
            <span className="font-semibold">AidAgent</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600 flex items-center gap-1">
              <Twitter size={16} />
              Twitter
            </a>
            <a href="#" className="hover:text-blue-600 flex items-center gap-1">
              <Send size={16} />
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};