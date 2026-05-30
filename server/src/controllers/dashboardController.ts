import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import Budget from "../models/Budget";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
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

// Get dashboard summary data
export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get all transactions
    const transactions = await Transaction.find({ user: userId });

    // Get total income (type: "income")
    const incomes = transactions.filter((t) => t.type === "income");
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    // Get total expenses (type: "expense")
    const expenses = transactions.filter((t) => t.type === "expense");
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate balance
    const balance = totalIncome - totalExpense;

    // Get savings (could be calculated from budgets or a separate calculation)
    const savings = balance > 0 ? balance : 0;

    // Get expenses by category for the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const expensesByCategory: Record<string, number> = {};
    monthlyExpenses.forEach((expense) => {
      expensesByCategory[expense.category] =
        (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    // Get recent transactions (last 5)
    const recentTransactions = [
      ...incomes.slice(0, 3).map((income) => ({
        id: income._id,
        title: income.title,
        amount: income.amount,
        date: income.date,
        type: "income" as const,
        category: income.category,
      })),
      ...expenses.slice(0, 3).map((expense) => ({
        id: expense._id,
        title: expense.title,
        amount: -expense.amount,
        date: expense.date,
        type: "expense" as const,
        category: expense.category,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Get monthly data for chart (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
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

      monthlyData.push({
        month: NEPALI_MONTHS[date.getMonth()],
        income: monthIncomes.reduce((sum, income) => sum + income.amount, 0),
        expense: monthExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        ),
      });
    }

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      savings,
      expensesByCategory,
      recentTransactions,
      monthlyData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard summary", error });
  }
};
