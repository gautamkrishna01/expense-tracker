import { Request, Response } from "express";
import Expense from "../models/Expense";
import Income from "../models/Income";
import Budget from "../models/Budget";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Get comprehensive financial report data
export const getFinancialReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate, period = "6months" } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    } else {
      switch (period) {
        case "1month":
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          break;
        case "3months":
          start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case "6months":
          start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          break;
        case "1year":
          start = new Date(now.getFullYear() - 1, now.getMonth(), 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      }
    }

    // Get all expenses and incomes for the user
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lte: end },
    });
    const incomes = await Income.find({
      user: userId,
      date: { $gte: start, $lte: end },
    });

    // Calculate totals
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const balance = totalIncome - totalExpense;
    const savingsRateNum = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
    const savingsRate = savingsRateNum.toFixed(1);

    // Monthly data for the period
    const monthlyData: {
      month: string;
      income: number;
      expense: number;
      savings: number;
    }[] = [];
    const monthsCount = period === "1year" ? 12 : period === "3months" ? 3 : 6;

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthIncomes = incomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getMonth() === month && incomeDate.getFullYear() === year
        );
      });

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === month && expenseDate.getFullYear() === year
        );
      });

      const monthIncome = monthIncomes.reduce(
        (sum, income) => sum + income.amount,
        0
      );
      const monthExpense = monthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      monthlyData.push({
        month: date.toLocaleString("default", { month: "short" }),
        income: monthIncome,
        expense: monthExpense,
        savings: monthIncome - monthExpense,
      });
    }

    // Expenses by category
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((expense) => {
      expensesByCategory[expense.category] =
        (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    // Category data for pie chart
    const categoryData = Object.entries(expensesByCategory).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Income by source
    const incomeBySource: Record<string, number> = {};
    incomes.forEach((income) => {
      incomeBySource[income.source] =
        (incomeBySource[income.source] || 0) + income.amount;
    });

    // Budget performance
    const budgets = await Budget.find({ user: userId });
    const budgetPerformance = budgets.map((budget) => ({
      title: budget.title,
      category: budget.category,
      budgeted: budget.amount,
      spent: budget.spent,
      remaining: budget.amount - budget.spent,
      percentage: ((budget.spent / budget.amount) * 100).toFixed(1),
    }));

    // Calculate average expense
    const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

    // Find best saving month
    let bestSaving = { amount: 0, month: "" };
    monthlyData.forEach((data) => {
      if (data.savings > bestSaving.amount) {
        bestSaving = { amount: data.savings, month: data.month };
      }
    });

    // Previous period comparison
    const prevStart = new Date(start);
    prevStart.setMonth(prevStart.getMonth() - monthsCount);
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);

    const prevExpenses = await Expense.find({
      user: userId,
      date: { $gte: prevStart, $lte: prevEnd },
    });
    const prevIncomes = await Income.find({
      user: userId,
      date: { $gte: prevStart, $lte: prevEnd },
    });

    const prevTotalIncome = prevIncomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const prevTotalExpense = prevExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const prevSavings = prevTotalIncome - prevTotalExpense;

    const savingsChange =
      prevSavings !== 0
        ? (((balance - prevSavings) / Math.abs(prevSavings)) * 100).toFixed(1)
        : 0;

    // Year-to-date data
    const ytdStart = new Date(now.getFullYear(), 0, 1);
    const ytdExpenses = await Expense.find({
      user: userId,
      date: { $gte: ytdStart, $lte: now },
    });
    const ytdIncomes = await Income.find({
      user: userId,
      date: { $gte: ytdStart, $lte: now },
    });

    const ytdTotalIncome = ytdIncomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const ytdTotalExpense = ytdExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const ytdSavings = ytdTotalIncome - ytdTotalExpense;

    // YTD change (compare with previous year)
    const prevYtdStart = new Date(now.getFullYear() - 1, 0, 1);
    const prevYtdEnd = new Date(now.getFullYear() - 1, 11, 31);
    const prevYtdIncomes = await Income.find({
      user: userId,
      date: { $gte: prevYtdStart, $lte: prevYtdEnd },
    });
    const prevYtdTotalIncome = prevYtdIncomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const ytdChange =
      prevYtdTotalIncome !== 0
        ? (
            ((ytdTotalIncome - prevYtdTotalIncome) / prevYtdTotalIncome) *
            100
          ).toFixed(1)
        : 0;

    // Opening and closing balance (simplified - based on first and last transactions)
    const openingBalance = totalIncome > 0 ? totalIncome - totalExpense : 0;
    const closingBalance = balance;

    // Generate insights
    const insights: string[] = [];
    const maxCategory = categoryData.reduce(
      (max, cat) => (cat.value > max.value ? cat : max),
      { name: "", value: 0 }
    );

    if (maxCategory.name) {
      insights.push(
        `Your highest spending category is "${maxCategory.name}" with Rs. ${maxCategory.value} total.`
      );
    }

    if (savingsRateNum > 20) {
      insights.push(
        `Great job! Your savings rate of ${savingsRate}% is above average.`
      );
    } else if (savingsRateNum > 0) {
      insights.push(
        `Your savings rate is ${savingsRate}%. Consider reducing expenses to increase savings.`
      );
    }

    const overBudgetCategories = budgetPerformance.filter(
      (b) => parseFloat(b.percentage) > 100
    );
    if (overBudgetCategories.length > 0) {
      insights.push(
        `You've exceeded budget in ${overBudgetCategories.length} categor${
          overBudgetCategories.length > 1 ? "ies" : "y"
        }.`
      );
    }

    res.status(200).json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
        savingsRate: `${savingsRate}%`,
        avgExpense,
        bestSaving,
        savingsChange: `${savingsChange}%`,
        ytdSavings,
        ytdChange: `${ytdChange}%`,
        openingBalance,
        closingBalance,
      },
      monthlyData,
      categoryData,
      incomeBySource,
      budgetPerformance,
      insights,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching financial report", error });
  }
};

// Get category-wise spending report
export const getCategoryReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate, period = "6months" } = req.query;

    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    }

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lte: end },
    });

    // Group by category
    const categoryData: Record<
      string,
      { total: number; count: number; average: number }
    > = {};
    expenses.forEach((expense) => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = { total: 0, count: 0, average: 0 };
      }
      categoryData[expense.category].total += expense.amount;
      categoryData[expense.category].count += 1;
    });

    // Calculate averages
    Object.keys(categoryData).forEach((cat) => {
      categoryData[cat].average =
        categoryData[cat].total / categoryData[cat].count;
    });

    res.status(200).json({
      categoryData,
      totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category report", error });
  }
};

// Get trend analysis report
export const getTrendReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { period = "12months" } = req.query;

    const now = new Date();
    const monthsCount = period === "12months" ? 12 : 6;
    const start = new Date(now.getFullYear(), now.getMonth() - monthsCount, 1);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lte: now },
    });
    const incomes = await Income.find({
      user: userId,
      date: { $gte: start, $lte: now },
    });

    // Monthly trends
    const trends: {
      month: string;
      income: number;
      expense: number;
      savings: number;
    }[] = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthIncomes = incomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getMonth() === month && incomeDate.getFullYear() === year
        );
      });

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === month && expenseDate.getFullYear() === year
        );
      });

      const monthIncome = monthIncomes.reduce(
        (sum, income) => sum + income.amount,
        0
      );
      const monthExpense = monthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      trends.push({
        month: date.toLocaleString("default", { month: "short" }),
        income: monthIncome,
        expense: monthExpense,
        savings: monthIncome - monthExpense,
      });
    }

    res.status(200).json({ trends });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trend report", error });
  }
};

// Get budget performance report
export const getBudgetReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const budgets = await Budget.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    // Calculate actual spending per category
    const expensesByCategory: Record<string, number> = {};
    expenses.forEach((expense) => {
      expensesByCategory[expense.category] =
        (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    const budgetPerformance = budgets.map((budget) => ({
      id: budget._id,
      title: budget.title,
      category: budget.category,
      budgeted: budget.amount,
      spent: budget.spent,
      actual: expensesByCategory[budget.category] || 0,
      remaining: budget.amount - budget.spent,
      percentage: ((budget.spent / budget.amount) * 100).toFixed(1),
      status:
        budget.spent > budget.amount
          ? "over"
          : budget.spent > budget.amount * 0.8
          ? "warning"
          : "good",
    }));

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    res.status(200).json({
      budgetPerformance,
      totalBudgeted,
      totalSpent,
      overallPercentage:
        totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget report", error });
  }
};
