import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchQuizzes, setFilters } from '../../store/slices/quizSlice';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import QuizCard from './QuizCard';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';

const QuizList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizzes, loading, totalPages, currentPage, filters } = useAppSelector(state => state.quiz);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    loadCategories();
    loadQuizzes();
  }, [filters, currentPage]);

  const loadCategories = async () => {
    const response = await categoryService.getCategories();
    if (response.success) {
      setCategories(response.data);
    }
  };

  const loadQuizzes = () => {
    dispatch(fetchQuizzes({
      page: currentPage,
      pageSize: 10,
      searchTerm: filters.search,
      categoryId: filters.categoryId,
      difficulty: filters.difficultyLevel
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/leaderboard/quiz/${quizId}`);
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
           
           <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </form> 
           


          {/* Category Filter */}
          <select
            value={filters.categoryId || ''}
            onChange={(e) => handleFilterChange('categoryId', e.target.value || null)}
            className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={filters.difficultyLevel || ''}
            onChange={(e) => handleFilterChange('difficultyLevel', e.target.value || null)}
            className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
          >
            <option value="">All Difficulties</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>
      </div>
      
      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onTakeQuiz={handleTakeQuiz}
            onViewLeaderboard={handleViewLeaderboard}
          />
        ))}
      </div>

      {/* Empty State */}
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;
