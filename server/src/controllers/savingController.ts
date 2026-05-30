import { Request, Response } from "express";
import mongoose from "mongoose";
import Saving from "../models/Saving";

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

export const getSavings = async (req: AuthRequest, res: Response) => {
  try {
    const {
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
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const filter: any = { user: new mongoose.Types.ObjectId(userId) };

    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;

    if (month && month !== "All") {
      const monthIndex = NEPALI_MONTHS.indexOf(month as string) + 1;
      const monthStr = monthIndex.toString().padStart(2, "0");
      filter.date = { $regex: `^\\d{4}-${monthStr}-\\d{2}` };
    }

    if (startDate || endDate) {
      filter.date = filter.date || {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    let sort: any = { date: -1 };
    if (sortBy === "oldest") sort = { date: 1 };
    else if (sortBy === "amount-high") sort = { amount: -1 };
    else if (sortBy === "amount-low") sort = { amount: 1 };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [savings, total, totals] = await Promise.all([
      Saving.find(filter).sort(sort).skip(skip).limit(limitNum),
      Saving.countDocuments(filter),
      Saving.aggregate([
        { $match: filter },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    res.status(200).json({
      data: savings,
      totalAmount: totals[0]?.totalAmount || 0,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        current: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching savings" });
  }
};

export const getSavingById = async (req: AuthRequest, res: Response) => {
  try {
    const saving = await Saving.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!saving) {
      return res.status(404).json({ message: "Saving not found" });
    }
    res.status(200).json(saving);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saving" });
  }
};

export const createSaving = async (req: AuthRequest, res: Response) => {
  try {
    const saving = new Saving({ ...req.body, user: req.user?.id });
    await saving.save();
    res.status(201).json(saving);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error creating saving" });
  }
};

export const updateSaving = async (req: AuthRequest, res: Response) => {
  try {
    const saving = await Saving.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!saving) {
      return res.status(404).json({ message: "Saving not found" });
    }
    res.status(200).json(saving);
  } catch (error) {
    res.status(400).json({ message: "Error updating saving" });
  }
};

export const deleteSaving = async (req: AuthRequest, res: Response) => {
  try {
    const saving = await Saving.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!saving) {
      return res.status(404).json({ message: "Saving not found" });
    }
    res.status(200).json({ message: "Saving deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting saving" });
  }
};
