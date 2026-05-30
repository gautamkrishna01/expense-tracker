import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  Calendar,
  ChevronRight,
} from "lucide-react";

const Reports = () => {
  // Mock data for analytics
  const monthlyData = [
    { name: "Jan", income: 4500, expenses: 3200 },
    { name: "Feb", income: 5200, expenses: 3100 },
    { name: "Mar", income: 4800, expenses: 4200 },
    { name: "Apr", income: 6100, expenses: 3800 },
    { name: "May", income: 5500, expenses: 4000 },
    { name: "Jun", income: 5900, expenses: 3600 },
  ];

  const categoryData = [
    { name: "Housing", value: 1500, color: "#4f46e5" }, // indigo-600
    { name: "Food", value: 600, color: "#10b981" }, // emerald-500
    { name: "Shopping", value: 450, color: "#f59e0b" }, // amber-500
    { name: "Travel", value: 300, color: "#f43f5e" }, // rose-500
    { name: "Health", value: 200, color: "#a78bfa" }, // violet-400
  ];

  const stats = [
    {
      label: "Savings Rate",
      value: "38%",
      sub: "8% higher than last month",
      icon: <Target className="h-5 w-5 text-indigo-600" />,
    },
    {
      label: "Avg. Expense",
      value: "Rs. 3,450",
      sub: "Based on last 6 months",
      icon: <TrendingDown className="h-5 w-5 text-rose-500" />,
    },
    {
      label: "Best Saving",
      value: "Rs. 2,300",
      sub: "Achieved in April",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Financial Reports
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Detailed analysis of your financial journey.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            Last 6 Months
          </button>
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
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4"
          >
            <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900">
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
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-900">
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
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
              />
              <Tooltip
                cursor={{ fill: "#f9fafb" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="income"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="expenses"
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
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-8">
            Expense Distribution
          </h3>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-bold text-gray-600">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">
                    Rs. {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings Trend (Line Chart) */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Savings Growth</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +22% Year-to-date
            </span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#9ca3af" }}
                />
                <YAxis hide />
                <Tooltip />
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
              <p className="text-sm font-extrabold text-gray-900">Rs. 12,450</p>
            </div>
            <ChevronRight className="text-gray-300 h-4 w-4" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Closing Balance
              </p>
              <p className="text-sm font-extrabold text-indigo-600">
                Rs. 15,820
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-2">Smart Financial Insight</h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Your spending in <strong>"Food & Drinks"</strong> increased by 15%
              this month. Consider adjusting your{" "}
              <strong>Monthly Grocery Budget</strong> to stay on track with your
              Rs. 20,000 yearly savings goal.
            </p>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-all">
            View Budget Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
