import React, { useState } from 'react';
import { Search, Wallet, TrendingUp, AlertTriangle, Download, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { WalletData, TokenData } from '../types';

export const WalletTracker: React.FC = () => {
  const [address, setAddress] = useState('');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData: WalletData = {
        address,
        balance: 3.45,
        totalValue: 12450.78,
        riskScore: 7.2,
        tokens: [
          { symbol: 'ETH', name: 'Ethereum', price: 1850.45, balance: 3.45, marketCap: 220000000000, riskScore: 2.1 },
          { symbol: 'USDC', name: 'USD Coin', price: 1.00, balance: 5000, marketCap: 55000000000, riskScore: 1.2 },
          { symbol: 'PEPE', name: 'Pepe', price: 0.00000123, balance: 1000000, marketCap: 500000000, riskScore: 9.5 },
        ],
      };
      
      setWalletData(mockData);
      setLoading(false);
    }, 1500);
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-600 bg-green-100';
    if (score <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 3) return 'Low Risk';
    if (score <= 7) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">Wallet Tracker</h1>
        <p className="text-gray-600">Analyze wallets and tokens with AI-powered insights</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleAnalyze} className="flex gap-4">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address or token contract"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : <><Search size={20} className="mr-2" /> Analyze</>}
          </Button>
        </form>
      </div>

      {/* Results */}
      {walletData && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Wallet Overview</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye size={16} className="mr-2" />
                  Add to Watchlist
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="text-blue-600" size={24} />
                  <h3 className="font-semibold">Total Value</h3>
                </div>
                <p className="text-2xl font-bold">${walletData.totalValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">ETH: {walletData.balance}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="font-semibold">Performance</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">+12.5%</p>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="text-yellow-600" size={24} />
                  <h3 className="font-semibold">Risk Score</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{walletData.riskScore}/10</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(walletData.riskScore)}`}>
                    {getRiskLabel(walletData.riskScore)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Token Holdings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Token Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Token</th>
                    <th className="text-right py-2">Balance</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Value</th>
                    <th className="text-right py-2">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.tokens.map((token, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-gray-600">{token.name}</div>
                        </div>
                      </td>
                      <td className="text-right py-3">
                        {token.balance.toLocaleString()}
                      </td>
                      <td className="text-right py-3">
                        ${token.price.toLocaleString()}
                      </td>
                      <td className="text-right py-3">
                        ${(token.balance * token.price).toLocaleString()}
                      </td>
                      <td className="text-right py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(token.riskScore)}`}>
                          {token.riskScore}/10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};