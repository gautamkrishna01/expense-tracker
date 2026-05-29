import React from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  PiggyBank,
  TrendingUp,
  LayoutDashboard,
  MoreHorizontal,
} from "lucide-react";

const Dashboard = () => {
  // Mock data - in a real app, this would come from your backend/state
  const stats = [
    {
      label: "Total Balance",
      amount: "$12,450.00",
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: "bg-indigo-600",
      trend: "+2.5%",
    },
    {
      label: "Total Income",
      amount: "$8,200.00",
      icon: <ArrowUpCircle className="h-6 w-6 text-white" />,
      color: "bg-emerald-500",
      trend: "+12%",
    },
    {
      label: "Total Expense",
      amount: "$3,150.00",
      icon: <ArrowDownCircle className="h-6 w-6 text-white" />,
      color: "bg-rose-500",
      trend: "-5%",
    },
    {
      label: "Savings",
      amount: "$5,050.00",
      icon: <PiggyBank className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
      trend: "+8.2%",
    },
  ];

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
            {/* You can integrate Recharts or Chart.js here */}
            <span className="text-sm font-medium italic">
              Chart visualization area
            </span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-8">
            Spending by Category
          </h3>
          <div className="space-y-6">
            {[
              { label: "Housing", value: 45, color: "bg-indigo-500" },
              { label: "Food & Drinks", value: 20, color: "bg-emerald-500" },
              { label: "Shopping", value: 15, color: "bg-amber-500" },
              { label: "Transportation", value: 10, color: "bg-rose-500" },
              { label: "Entertainment", value: 10, color: "bg-violet-400" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-semibold">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
