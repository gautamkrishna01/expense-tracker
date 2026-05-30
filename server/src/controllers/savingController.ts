import { Request, Response } from "express";
import Saving from "../models/Saving";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getSavings = async (req: AuthRequest, res: Response) => {
  try {
    const savings = await Saving.find({ user: req.user?.id });
    res.status(200).json(savings);
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
