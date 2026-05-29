import { Request, Response } from "express";
import Income from "../models/Income";

export const getIncomes = async (req: Request, res: Response) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching incomes", error });
  }
};

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income", error });
  }
};

export const createIncome = async (req: Request, res: Response) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: "Error creating income", error });
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(400).json({ message: "Error updating income", error });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
};
