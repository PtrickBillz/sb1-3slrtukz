import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { DatabaseStatus } from '../ui/DatabaseStatus';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between lg:justify-end">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={20} />
      </button>
      
      <div className="flex items-center gap-4">
        <DatabaseStatus />
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
          <span className="hidden sm:block text-sm font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
};