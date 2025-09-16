"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { quizService } from "../../services/quizService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const QuizProgressChart = ({ quizId, quizTitle }) => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [quizId]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const response = await quizService.getQuizProgress(quizId);
      if (response.success) {
        setProgressData(response.data);
      }
    } catch (error) {
      console.error("Failed to load progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-6 w-6"></div>
      </div>
    );
  }

  if (!progressData || progressData.attempts.length <= 1) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">The progress chart will be available after multiple attempts</p>
      </div>
    );
  }

  const chartData = {
    labels: progressData.attempts.map((attempt) => `Attempt ${attempt.attemptNumber}`),
    datasets: [
      {
        label: "Score (%)",
        data: progressData.attempts.map((attempt) => attempt.score),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Progress through attempts - ${quizTitle}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + "%",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Chart</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{progressData.bestScore.toFixed(1)}%</div>
            <div className="text-gray-500">Best Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progressData.averageScore.toFixed(1)}%</div>
            <div className="text-gray-500">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{progressData.totalAttempts}</div>
            <div className="text-gray-500">Total Attempts</div>
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default QuizProgressChart;
