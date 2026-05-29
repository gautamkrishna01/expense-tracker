import { Request, Response } from "express";
import Budget from "../models/Budget";

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget", error });
  }
};

export const createBudget = async (req: Request, res: Response) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: "Error creating budget", error });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ message: "Error updating budget", error });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error });
  }
};
