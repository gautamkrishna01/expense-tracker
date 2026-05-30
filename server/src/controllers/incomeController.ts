import { Request, Response } from "express";
import Income from "../models/Income";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getIncomes = async (req: AuthRequest, res: Response) => {
  try {
    const incomes = await Income.find({ user: req.user?.id });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes" });
  }
};

export const getIncomeById = async (req: AuthRequest, res: Response) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income" });
  }
};

export const createIncome = async (req: AuthRequest, res: Response) => {
  try {
    const income = new Income({ ...req.body, user: req.user?.id });
    await income.save();
    res.status(201).json(income);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error creating income" });
  }
};

export const updateIncome = async (req: AuthRequest, res: Response) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(400).json({ message: "Error updating income" });
  }
};

export const deleteIncome = async (req: AuthRequest, res: Response) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user?.id,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income" });
  }
};
