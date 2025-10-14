import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DepartmentAnalytics = ({ departmentStats }) => {
  // Prepare data for charts
  const departmentNames = departmentStats.map(stat => stat._id);
  const completedTasks = departmentStats.map(stat => stat.completed);
  const inProgressTasks = departmentStats.map(stat => stat.inProgress);
  const totalTasks = departmentStats.map(stat => stat.total);
  const avgProgress = departmentStats.map(stat => Math.round(stat.avgProgress || 0));

  // Line chart for progress trends
  const progressChartData = {
    labels: departmentNames,
    datasets: [
      {
        label: 'Average Progress (%)',
        data: avgProgress,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Bar chart for task completion
  const taskCompletionData = {
    labels: departmentNames,
    datasets: [
      {
        label: 'Completed',
        data: completedTasks,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'In Progress',
        data: inProgressTasks,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart for overall completion rate
  const totalCompleted = completedTasks.reduce((sum, val) => sum + val, 0);
  const totalInProgress = inProgressTasks.reduce((sum, val) => sum + val, 0);
  const totalNotStarted = departmentStats.reduce((sum, stat) => sum + stat.notStarted, 0);

  const completionData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [totalCompleted, totalInProgress, totalNotStarted],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      {/* Progress Trends */}
      <div className="bg-white rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Department Progress Trends</h3>
        <div className="h-64">
          <Line data={progressChartData} options={chartOptions} />
        </div>
      </div>

      {/* Overall Completion */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Overall Task Status</h3>
        <div className="h-64">
          <Doughnut data={completionData} options={doughnutOptions} />
        </div>
      </div>

      {/* Task Completion by Department */}
      <div className="bg-white rounded-xl shadow-lg p-6 col-span-1 lg:col-span-3">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Task Completion by Department</h3>
        <div className="h-80">
          <Bar data={taskCompletionData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DepartmentAnalytics;