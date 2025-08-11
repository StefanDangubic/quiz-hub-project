import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LogOut, User, BookOpen, Trophy, TrendingUp, Clock } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.getDisplayName()}!
            </h2>
            <p className="mt-1 text-gray-600">
              Ready to test your knowledge?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Quizzes Taken</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : userStats?.totalQuizzesTaken || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Average Score</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : `${userStats?.averageScore?.toFixed(1) || 0}%`}
                  </p>
                </div>
              </div>
            </div>

             <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Best Score</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : userStats?.bestScore || 0}
                  </p>
                </div>
              </div>
            </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Global Rank</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? '...' : userStats?.globalRank > 0 ? `#${userStats.globalRank}` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/quizzes"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Browse Quizzes</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900">View Leaderboard</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
           </div>
          </div>

          
            {/* Category Performance */}

        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
