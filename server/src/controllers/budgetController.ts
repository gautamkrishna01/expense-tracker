import { Request, Response } from "express";
import mongoose from "mongoose";
import Budget from "../models/Budget";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = "",
      category = "All",
      month = "All",
      sortBy = "newest",
    } = req.query;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const filter: any = { user: new mongoose.Types.ObjectId(userId) };

    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;
    if (month && month !== "All") filter.month = month;

    let sort: any = { createdAt: -1 };
    if (sortBy === "amount-high") sort = { amount: -1 };
    else if (sortBy === "amount-low") sort = { amount: 1 };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [budgets, total, totals] = await Promise.all([
      Budget.find(filter).sort(sort).skip(skip).limit(limitNum),
      Budget.countDocuments(filter),
      Budget.aggregate([
        { $match: filter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    res.status(200).json({
      data: budgets,
      totalAmount: totals[0]?.totalAmount || 0,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        current: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error });
  }
};

export const getBudgetById = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget", error });
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = new Budget({ ...req.body, user: req.user?.id });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: "Error creating budget", error });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ message: "Error updating budget", error });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error });
  }
};
