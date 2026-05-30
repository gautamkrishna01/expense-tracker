import React, { useState, useEffect, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { reportsAPI } from "../services/api";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: string;
  avgExpense: number;
  bestSaving: { amount: number; month: string };
  savingsChange: string;
  ytdSavings: number;
  ytdChange: string;
  openingBalance: number;
  closingBalance: number;
}

const NEPALI_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangshir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const Reports = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("6months");

  const userContext = useContext(UserContext);
  const currencyCode = userContext?.user?.settings?.currency || "USD";
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "$";

  // Color palette for categories
  const categoryColors = [
    "#4f46e5", // indigo-600
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#f43f5e", // rose-500
    "#a78bfa", // violet-400
    "#06b6d4", // cyan-500
    "#84cc16", // lime-500
    "#ec4899", // pink-500
  ];

  // Helper to format month names to Nepali
  const formatMonth = (month: string) => {
    const monthMap: Record<string, string> = {
      Jan: "Baisakh",
      Feb: "Jestha",
      Mar: "Ashadh",
      Apr: "Shrawan",
      May: "Bhadra",
      Jun: "Ashwin",
      Jul: "Kartik",
      Aug: "Mangshir",
      Sep: "Poush",
      Oct: "Magh",
      Nov: "Falgun",
      Dec: "Chaitra",
      January: "Baisakh",
      February: "Jestha",
      March: "Ashadh",
      April: "Shrawan",
      May_: "Bhadra",
      June: "Ashwin",
      July: "Kartik",
      August: "Mangshir",
      September: "Poush",
      October: "Magh",
      November: "Falgun",
      December: "Chaitra",
    };
    // Map English names (standard from most backends) to Nepali names
    return monthMap[month] || month;
  };

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await reportsAPI.getFinancialReport({ period });
        const data = response.data;

        setMonthlyData(data.monthlyData || []);
        setCategoryData(data.categoryData || []);
        setSummary(data.summary || null);
        setInsights(data.insights || []);
      } catch (err) {
        setError("Failed to load report data");
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [period]);

  const stats = summary
    ? [
        {
          label: "Savings Rate",
          value: summary.savingsRate,
          sub: summary.savingsChange,
          icon: <Target className="h-5 w-5 text-indigo-600" />,
        },
        {
          label: "Avg. Expense",
          value: `${currencySymbol} ${summary.avgExpense.toLocaleString(
            "en-IN"
          )}`,
          sub: `Based on last ${
            period === "1year"
              ? "year"
              : period === "3months"
              ? "3 months"
              : "6 months"
          }`,
          icon: <TrendingDown className="h-5 w-5 text-rose-500" />,
        },
        {
          label: "Best Saving",
          value: `${currencySymbol} ${summary.bestSaving.amount.toLocaleString(
            "en-IN"
          )}`,
          sub: `Achieved in ${formatMonth(summary.bestSaving.month) || "N/A"}`,
          icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Financial Reports
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Detailed analysis of your financial journey.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1month">Last 1 Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-200 text-sm font-bold text-white hover:bg-indigo-700 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4"
          >
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Income vs Expenses Chart */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Income vs Expenses Comparison
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-xs font-bold text-gray-500">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm mr-2" /> Income
            </div>
            <div className="flex items-center text-xs font-bold text-gray-500">
              <div className="w-3 h-3 bg-rose-400 rounded-sm mr-2" /> Expenses
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-700"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
                dy={10}
                tickFormatter={formatMonth}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
              />
              <Tooltip
                cursor={{ fill: "currentColor", opacity: 0.1 }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--tooltip-bg, #fff)",
                  color: "var(--tooltip-color, #000)",
                }}
                labelFormatter={formatMonth}
              />
              <Bar
                dataKey="income"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="expense"
                fill="#fb7185"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown (Pie Chart) */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">
            Expense Distribution
          </h3>
          {categoryData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-center">
              <div className="h-[250px] w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={categoryColors[index % categoryColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-4 md:pl-8 mt-6 md:mt-0">
                {categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{
                          backgroundColor:
                            categoryColors[i % categoryColors.length],
                        }}
                      />
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {currencySymbol} {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No expense data available for the selected period.
            </p>
          )}
        </div>

        {/* Savings Trend (Line Chart) */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Savings Growth
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              {summary?.ytdChange || "+0%"} Year-to-date
            </span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-gray-700"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
                  tickFormatter={formatMonth}
                />
                <YAxis hide />
                <Tooltip labelFormatter={formatMonth} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#4f46e5",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Opening Balance
              </p>
              <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                {currencySymbol}{" "}
                {summary?.openingBalance.toLocaleString("en-IN") || "0"}
              </p>
            </div>
            <ChevronRight className="text-gray-300 dark:text-gray-600 h-4 w-4" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Closing Balance
              </p>
              <p className="text-sm font-extrabold text-indigo-600">
                {currencySymbol}{" "}
                {summary?.closingBalance.toLocaleString("en-IN") || "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">
                Smart Financial Insights
              </h3>
              <ul className="text-indigo-100 text-sm leading-relaxed space-y-2">
                {insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
            <button className="whitespace-nowrap px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all">
              View Budget Strategy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
