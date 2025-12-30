import React, { useState, useEffect, useRef } from 'react';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { FiDownload, FiX, FiTrendingUp, FiTrendingDown, FiDollarSign, FiBarChart2, FiPieChart, FiCalendar, FiZap } from 'react-icons/fi';
import moment from 'moment';
import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/api';
import Swal from 'sweetalert2';

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

const IncomeExpenseReports = ({ records, onClose, currentUser }) => {
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  const reportRef = useRef(null);

  // Filter records by selected month
  const filteredRecords = records.filter(record => {
    const recordDate = moment(record.date);
    return recordDate.format('YYYY-MM') === selectedMonth;
  });

  // Calculate financial metrics
  const calculateMetrics = () => {
    const income = filteredRecords
      .filter(r => r.transactionType === 'Income')
      .reduce((sum, r) => sum + (r.credit || 0), 0);
    
    const expense = filteredRecords
      .filter(r => r.transactionType === 'Expense')
      .reduce((sum, r) => sum + (r.debit || 0), 0);
    
    const profit = income - expense;
    const profitMargin = income > 0 ? ((profit / income) * 100).toFixed(2) : 0;
    const totalTransactions = filteredRecords.length;
    
    return {
      income,
      expense,
      profit,
      profitMargin,
      totalTransactions,
      avgDailyIncome: income / moment(selectedMonth, 'YYYY-MM').daysInMonth(),
      avgDailyExpense: expense / moment(selectedMonth, 'YYYY-MM').daysInMonth()
    };
  };

  const metrics = calculateMetrics();

  // Prepare chart data - Income vs Expense by day
  const getDailyData = () => {
    const daysInMonth = moment(selectedMonth, 'YYYY-MM').daysInMonth();
    const dailyIncome = Array(daysInMonth).fill(0);
    const dailyExpense = Array(daysInMonth).fill(0);
    
    filteredRecords.forEach(record => {
      const day = moment(record.date).date() - 1;
      if (record.transactionType === 'Income') {
        dailyIncome[day] += record.credit || 0;
      } else {
        dailyExpense[day] += record.debit || 0;
      }
    });

    return {
      labels: Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`),
      income: dailyIncome,
      expense: dailyExpense
    };
  };

  const dailyData = getDailyData();

  // Line chart - Income vs Expense trend
  const trendChartData = {
    labels: dailyData.labels,
    datasets: [
      {
        label: 'Income',
        data: dailyData.income,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expense',
        data: dailyData.expense,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Bar chart - Income vs Expense comparison
  const comparisonChartData = {
    labels: ['Income', 'Expense', 'Profit'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [metrics.income, metrics.expense, metrics.profit],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          metrics.profit >= 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          metrics.profit >= 0 ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart - Source Type distribution
  const getSourceTypeData = () => {
    const sourceMap = {};
    filteredRecords.forEach(record => {
      const amount = record.transactionType === 'Income' ? (record.credit || 0) : (record.debit || 0);
      sourceMap[record.sourceType] = (sourceMap[record.sourceType] || 0) + amount;
    });

    return {
      labels: Object.keys(sourceMap),
      data: Object.values(sourceMap),
      colors: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ]
    };
  };

  const sourceTypeData = getSourceTypeData();
  const sourceTypeChartData = {
    labels: sourceTypeData.labels,
    datasets: [
      {
        data: sourceTypeData.data,
        backgroundColor: sourceTypeData.colors.slice(0, sourceTypeData.labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Generate AI Suggestions
  const generateAISuggestions = async () => {
    setGeneratingAI(true);
    try {
      const suggestions = [];
      
      // Analyze profit margin
      if (metrics.profitMargin < 10 && metrics.profit > 0) {
        suggestions.push({
          type: 'warning',
          title: 'Low Profit Margin',
          message: `Your profit margin is ${metrics.profitMargin}%. Consider reducing expenses or increasing revenue.`,
          icon: '📊'
        });
      }

      // Analyze expense ratio
      const expenseRatio = metrics.income > 0 ? (metrics.expense / metrics.income) * 100 : 0;
      if (expenseRatio > 80) {
        suggestions.push({
          type: 'danger',
          title: 'High Expense Ratio',
          message: `Your expenses are ${expenseRatio.toFixed(1)}% of income. Review and optimize your spending.`,
          icon: '⚠️'
        });
      }

      // Analyze daily averages
      if (metrics.avgDailyExpense > metrics.avgDailyIncome && metrics.avgDailyIncome > 0) {
        suggestions.push({
          type: 'info',
          title: 'Daily Spending Alert',
          message: `Average daily expenses (₹${metrics.avgDailyExpense.toFixed(2)}) exceed daily income (₹${metrics.avgDailyIncome.toFixed(2)}).`,
          icon: '💡'
        });
      }

      // Positive suggestions
      if (metrics.profitMargin > 20) {
        suggestions.push({
          type: 'success',
          title: 'Excellent Profit Margin',
          message: `Great job! Your profit margin of ${metrics.profitMargin}% indicates healthy financial management.`,
          icon: '🎉'
        });
      }

      // Transaction volume analysis
      if (metrics.totalTransactions < 10) {
        suggestions.push({
          type: 'info',
          title: 'Low Transaction Volume',
          message: `Only ${metrics.totalTransactions} transactions this month. Consider tracking more regularly for better insights.`,
          icon: '📝'
        });
      }

      // Top expense source
      const expenseBySource = {};
      filteredRecords
        .filter(r => r.transactionType === 'Expense')
        .forEach(r => {
          expenseBySource[r.sourceType] = (expenseBySource[r.sourceType] || 0) + (r.debit || 0);
        });
      
      const topExpenseSource = Object.entries(expenseBySource)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (topExpenseSource) {
        suggestions.push({
          type: 'info',
          title: 'Top Expense Source',
          message: `${topExpenseSource[0]} accounts for ₹${topExpenseSource[1].toFixed(2)} in expenses. Review if this is necessary.`,
          icon: '🔍'
        });
      }

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      Swal.fire('Error', 'Failed to generate AI suggestions', 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  useEffect(() => {
    generateAISuggestions();
  }, [selectedMonth, filteredRecords]);

  // Download PDF Report
  const downloadPDF = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Title
      doc.setFontSize(20);
      doc.text('Income & Expense Report', pageWidth / 2, 20, { align: 'center' });
      
      // Month
      doc.setFontSize(14);
      const monthText = moment(selectedMonth, 'YYYY-MM').format('MMMM YYYY');
      doc.text(`Month: ${monthText}`, pageWidth / 2, 30, { align: 'center' });
      
      // Metrics
      doc.setFontSize(12);
      let yPos = 45;
      doc.text(`Total Income: ₹${metrics.income.toFixed(2)}`, 20, yPos);
      yPos += 10;
      doc.text(`Total Expense: ₹${metrics.expense.toFixed(2)}`, 20, yPos);
      yPos += 10;
      doc.text(`Profit: ₹${metrics.profit.toFixed(2)}`, 20, yPos);
      yPos += 10;
      doc.text(`Profit Margin: ${metrics.profitMargin}%`, 20, yPos);
      yPos += 10;
      doc.text(`Total Transactions: ${metrics.totalTransactions}`, 20, yPos);
      yPos += 15;

      // Table
      if (filteredRecords.length > 0) {
        const tableData = filteredRecords.map((record, index) => [
          index + 1,
          moment(record.date).format('DD/MM/YYYY'),
          record.sourceType || '-',
          record.givenBy || '-',
          record.transactionType || '-',
          record.credit > 0 ? `₹${record.credit.toFixed(2)}` : '-',
          record.debit > 0 ? `₹${record.debit.toFixed(2)}` : '-',
          record.transactionMethod || '-',
          (record.comments || '-').substring(0, 30) // Limit comment length
        ]);

        try {
          doc.autoTable({
            startY: yPos,
            head: [['S No', 'Date', 'Source Type', 'Given By', 'Type', 'Credit', 'Debit', 'Method', 'Comments']],
            body: tableData,
            styles: { 
              fontSize: 7,
              cellPadding: 2
            },
            headStyles: { 
              fillColor: [99, 102, 241],
              textColor: 255,
              fontStyle: 'bold'
            },
            margin: { top: yPos, left: 14, right: 14 },
            tableWidth: 'auto',
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 25 },
              2: { cellWidth: 30 },
              3: { cellWidth: 30 },
              4: { cellWidth: 20 },
              5: { cellWidth: 25 },
              6: { cellWidth: 25 },
              7: { cellWidth: 25 },
              8: { cellWidth: 40 }
            }
          });
        } catch (tableError) {
          console.error('Error creating table:', tableError);
          doc.text('Error generating table data', 20, yPos);
        }
      } else {
        doc.setFontSize(12);
        doc.text('No transactions found for this month', 20, yPos);
      }

      // AI Suggestions
      let finalY = yPos;
      if (filteredRecords.length > 0) {
        try {
          finalY = doc.lastAutoTable.finalY + 15;
        } catch (e) {
          finalY = yPos + 30;
        }
      } else {
        finalY = yPos + 20;
      }

      if (finalY < pageHeight - 50 && aiSuggestions.length > 0) {
        doc.setFontSize(14);
        doc.text('AI Insights & Suggestions', 20, finalY);
        let suggestionY = finalY + 10;
        aiSuggestions.slice(0, 3).forEach((suggestion) => {
          if (suggestionY < pageHeight - 20) {
            doc.setFontSize(10);
            const suggestionText = `${suggestion.title}: ${suggestion.message}`;
            const splitText = doc.splitTextToSize(suggestionText, pageWidth - 40);
            doc.text(splitText, 20, suggestionY);
            suggestionY += splitText.length * 5 + 5;
          }
        });
      }

      // Footer
      const footerY = Math.min(pageHeight - 10, finalY + 30);
      doc.setFontSize(10);
      doc.text(
        `Generated on ${moment().format('DD/MM/YYYY HH:mm')} by ${currentUser?.name || 'System'}`,
        pageWidth / 2,
        footerY,
        { align: 'center' }
      );

      // Save PDF
      const fileName = `Income-Expense-Report-${selectedMonth}.pdf`;
      doc.save(fileName);
      
      // Show success message after a small delay to ensure PDF is saved
      setTimeout(() => {
        Swal.fire('Success', 'PDF report downloaded successfully!', 'success');
      }, 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire('Error', `Failed to generate PDF report: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Financial Reports & Analytics</h2>
              <p className="text-indigo-100 text-sm mt-1">Comprehensive financial insights and AI-powered suggestions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadPDF}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold disabled:opacity-50"
              >
                <FiDownload className="w-5 h-5" />
                {loading ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Month Selector */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                Select Month:
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Financial Metrics Cards */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white opacity-90">Total Revenue</span>
                  <FiTrendingUp className="w-6 h-6 text-white opacity-80" />
                </div>
                <p className="text-3xl font-bold text-white">{formatCurrency(metrics.income)}</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white opacity-90">Total Expenses</span>
                  <FiTrendingDown className="w-6 h-6 text-white opacity-80" />
                </div>
                <p className="text-3xl font-bold text-white">{formatCurrency(metrics.expense)}</p>
              </div>

              <div className={`bg-gradient-to-br rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px] ${
                metrics.profit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white opacity-90">Net Profit</span>
                  <FiDollarSign className="w-6 h-6 text-white opacity-80" />
                </div>
                <p className="text-3xl font-bold text-white">{formatCurrency(metrics.profit)}</p>
                <p className="text-sm mt-1 text-white opacity-90">Margin: {metrics.profitMargin}%</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg flex-1 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white opacity-90">Transactions</span>
                  <FiBarChart2 className="w-6 h-6 text-white opacity-80" />
                </div>
                <p className="text-3xl font-bold text-white">{metrics.totalTransactions}</p>
                <p className="text-sm mt-1 text-white opacity-90">Avg Daily: ₹{metrics.avgDailyIncome.toFixed(2)}</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Income vs Expense Trend */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Income vs Expense Trend</h3>
                <div className="h-80">
                  <Line
                    data={trendChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '₹' + value.toLocaleString('en-IN');
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Income vs Expense Comparison */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
                <div className="h-80">
                  <Bar
                    data={comparisonChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '₹' + value.toLocaleString('en-IN');
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Source Type Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPieChart className="w-5 h-5" />
                Source Type Distribution
              </h3>
              <div className="h-80 flex items-center justify-center">
                {sourceTypeData.labels.length > 0 ? (
                  <Doughnut
                    data={sourceTypeChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'right' },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ₹${context.parsed.toLocaleString('en-IN')}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <p className="text-gray-500">No data available for this month</p>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md border border-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <FiZap className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">AI-Powered Insights & Suggestions</h3>
                {generatingAI && (
                  <span className="text-sm text-gray-500">Analyzing...</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      suggestion.type === 'success' ? 'bg-green-50 border-green-500' :
                      suggestion.type === 'danger' ? 'bg-red-50 border-red-500' :
                      suggestion.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600">{suggestion.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {aiSuggestions.length === 0 && !generatingAI && (
                <p className="text-gray-500 text-center py-4">No suggestions available. Add more transactions for better insights.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseReports;

