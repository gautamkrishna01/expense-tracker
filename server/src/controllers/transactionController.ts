import { Request, Response } from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction";

interface AuthRequest extends Request {
  user?: { id: string };
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

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const {
      type,
      page = 1,
      limit = 8,
      search = "",
      category = "All",
      month = "All",
      startDate,
      endDate,
      sortBy = "newest",
    } = req.query;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Cast user ID to ObjectId for Aggregation Pipeline compatibility
    const filter: any = { user: new mongoose.Types.ObjectId(userId) };
    if (type) filter.type = type;

    // Search Filter
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Category Filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Nepali Month Filter
    if (month && month !== "All") {
      const monthIndex = NEPALI_MONTHS.indexOf(month as string) + 1;
      const monthStr = monthIndex.toString().padStart(2, "0");
      filter.date = { $regex: `^\\d{4}-${monthStr}-\\d{2}` };
    }

    // Date Range Filter
    if (startDate || endDate) {
      filter.date = filter.date || {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    // Sorting
    let sort: any = { date: -1 };
    if (sortBy === "oldest") sort = { date: 1 };
    else if (sortBy === "amount-high") sort = { amount: -1 };
    else if (sortBy === "amount-low") sort = { amount: 1 };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total, totals] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limitNum),
      Transaction.countDocuments(filter),
      Transaction.aggregate([
        { $match: filter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    res.status(200).json({
      data: transactions,
      totalAmount: totals[0]?.totalAmount || 0,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        current: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user?.id,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: error.message || "Error creating transaction" });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Error updating transaction" });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
};
