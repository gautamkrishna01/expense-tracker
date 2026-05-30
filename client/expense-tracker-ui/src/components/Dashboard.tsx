import React, { useEffect, useState, useContext } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  PiggyBank,
  TrendingUp,
  LayoutDashboard,
  MoreHorizontal,
} from "lucide-react";
import { dashboardAPI } from "../services/api";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savings: number;
  expensesByCategory: Record<string, number>;
  recentTransactions: Array<{
    id: string;
    title: string;
    amount: number;
    date: string;
    type: "income" | "expense";
    category: string;
  }>;
  monthlyData: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userContext = useContext(UserContext);
  const currencyCode = userContext?.user?.settings?.currency || "USD";
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "$";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getSummary();
        setSummary(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate trend percentages (mock calculation for now)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Get previous month's data for trend calculation
  const getPreviousMonthData = () => {
    if (!summary) return { income: 0, expense: 0 };
    const currentMonthIndex = summary.monthlyData.length - 1;
    const previousMonth =
      currentMonthIndex > 0
        ? summary.monthlyData[currentMonthIndex - 1]
        : { income: 0, expense: 0 };
    return previousMonth;
  };

  const previousMonth = getPreviousMonthData();

  const stats = summary
    ? [
        {
          label: "Total Balance",
          amount: `${currencySymbol} ${summary.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: <Wallet className="h-6 w-6 text-white" />,
          color: "bg-indigo-600",
          trend: calculateTrend(
            summary.balance,
            previousMonth.income - previousMonth.expense
          ),
        },
        {
          label: "Total Income",
          amount: `${currencySymbol} ${summary.totalIncome.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
          icon: <ArrowUpCircle className="h-6 w-6 text-white" />,
          color: "bg-emerald-500",
          trend: calculateTrend(summary.totalIncome, previousMonth.income),
        },
        {
          label: "Total Expense",
          amount: `${currencySymbol} ${summary.totalExpense.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
          icon: <ArrowDownCircle className="h-6 w-6 text-white" />,
          color: "bg-rose-500",
          trend: calculateTrend(summary.totalExpense, previousMonth.expense),
        },
        {
          label: "Savings",
          amount: `${currencySymbol} ${summary.savings.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: <PiggyBank className="h-6 w-6 text-white" />,
          color: "bg-amber-500",
          trend: calculateTrend(
            summary.savings,
            Math.max(0, previousMonth.income - previousMonth.expense)
          ),
        },
      ]
    : [];

  // Convert expenses by category to array for display
  const categoryData = summary
    ? Object.entries(summary.expensesByCategory).map(([label, value]) => ({
        label,
        value: Math.round((value / summary.totalExpense) * 100) || 0,
      }))
    : [];

  // Category colors
  const categoryColors: Record<string, string> = {
    Housing: "bg-indigo-500",
    "Food & Drinks": "bg-emerald-500",
    Shopping: "bg-amber-500",
    Transportation: "bg-rose-500",
    Entertainment: "bg-violet-400",
    Healthcare: "bg-blue-500",
    Education: "bg-green-500",
    Travel: "bg-pink-500",
    Other: "bg-gray-500",
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Financial Overview
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Welcome back, here's your summary.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Financial Overview
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Welcome back, here's your summary.
            </p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Financial Overview
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Welcome back, here's your summary.
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Manage Widgets
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default"
          >
            <div className={`${stat.color} p-3 rounded-xl shadow-inner`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {stat.amount}
              </h3>
              <div className="flex items-center mt-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}{" "}
                <span className="text-gray-400 ml-1 font-medium">
                  vs last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">
              Income vs Expenses Analytics
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-600 rounded-full">
                Monthly
              </button>
              <button className="px-3 py-1 text-xs font-bold text-gray-400 hover:bg-gray-50 rounded-full">
                Yearly
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <span className="text-sm font-medium italic">
              Chart visualization area
            </span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-8">
            Spending by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="space-y-6">
              {categoryData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-semibold">
                      {item.label}
                    </span>
                    <span className="font-bold text-gray-900">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${
                        categoryColors[item.label] || "bg-gray-500"
                      } h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No expense data available for this month
            </p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      {summary && summary.recentTransactions.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {summary.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-emerald-100"
                        : "bg-rose-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {transaction.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {currencySymbol}{" "}
                    {Math.abs(transaction.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {transaction.date.split("T")[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
