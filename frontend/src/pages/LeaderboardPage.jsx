import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LogOut, Trophy, Users, Target } from 'lucide-react';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import { leaderboardService } from '../services/leaderboardService';
import { categoryService } from '../services/categoryService';

const LeaderboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadLeaderboard();
  }, [activeTab, selectedCategory]);

  const loadCategories = async () => {
    const response = await categoryService.getCategories();
    if (response.success) {
      setCategories(response.data);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'global':
          response = await leaderboardService.getGlobalLeaderboard(100);
          break;
        case 'category':
          if (selectedCategory) {
            response = await leaderboardService.getCategoryLeaderboard(selectedCategory, 100);
          }
          break;
        default:
          response = await leaderboardService.getGlobalLeaderboard(100);
      }

      if (response?.success) {
        setLeaderboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'global', name: 'Global', icon: Trophy },
    { id: 'category', name: 'By Category', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="mt-2 text-gray-600">
              See how you rank against other quiz takers
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Category Filter */}
          {activeTab === 'category' && (
            <div className="mb-6">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Leaderboard Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8"></div>
            </div>
          ) : (
            <LeaderboardTable 
              entries={leaderboardData} 
              showQuizInfo={activeTab === 'global'} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaderboardPage;
