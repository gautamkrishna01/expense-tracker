import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  title: string;
  amount: number;
  spent: number;
  category: string;
  month: string;
  year: number;
  note?: string;
  user: mongoose.Types.ObjectId;
}

const BudgetSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    category: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", BudgetSchema);
