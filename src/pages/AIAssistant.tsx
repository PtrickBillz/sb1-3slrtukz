import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChatMessage } from '../types';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. I can help you analyze wallets, tokens, and provide DeFi insights. What would you like to know?",
      timestamp: new Date(),
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickPrompts = [
    'Analyze token risk',
    'Check wallet balance',
    'Market trends',
    'DeFi opportunities',
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I understand you want to " + inputMessage + ". Let me analyze that for you. Based on current market conditions and my analysis, here's what I found...",
        timestamp: new Date(),
        isUser: false,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <p className="text-sm text-gray-600">Your personal DeFi analyst</p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b bg-gray-50">
        <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.isUser ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.isUser 
                ? 'bg-blue-500' 
                : 'bg-gradient-to-r from-cyan-400 to-blue-500'
            }`}>
              {message.isUser ? (
                <User className="text-white" size={16} />
              ) : (
                <Bot className="text-white" size={16} />
              )}
            </div>
            
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.isUser
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about DeFi..."
            className="flex-1"
          />
          <Button type="submit" disabled={!inputMessage.trim()}>
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};