import React from 'react';
import { Clock, Users, BookOpen, Trophy } from 'lucide-react';

const QuizCard = ({ quiz, onTakeQuiz, onViewLeaderboard }) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border-l-4 border-l-blue-500 hover:transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quiz.description}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficultyLevel)}`}>
          {getDifficultyText(quiz.difficultyLevel)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{quiz.questionCount} questions</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{quiz.timeLimit} min</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          by {quiz.creatorUsername}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{quiz.categoryName}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewLeaderboard(quiz.id);
            }}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Trophy className="h-3 w-3 mr-1" />
            Leaderboard
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTakeQuiz(quiz.id);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
