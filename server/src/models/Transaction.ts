import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  title: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string; // Unifies Income Source and Expense Category
  paymentMethod?: string;
  note?: string;
  user: mongoose.Types.ObjectId;
}

const TransactionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
