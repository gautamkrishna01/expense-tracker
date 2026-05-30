import { Request, Response } from "express";
import Transaction from "../models/Transaction";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;
    const filter: any = { user: req.user?.id };
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
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
