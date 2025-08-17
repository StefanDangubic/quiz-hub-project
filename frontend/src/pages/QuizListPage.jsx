import QuizList from '../components/quiz/QuizList';
import { Link } from 'react-router-dom';

export default function QuizListPage() {
  return (
  <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Quizzes</h1>
            <p className="mt-2 text-gray-600">
              Discover and take quizzes on various topics
            </p>
          </div>

          <QuizList />
        </div>
  )
}
