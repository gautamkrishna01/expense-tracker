import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  title: string;
  amount: number;
  date: Date;
  category: string;
  paymentMethod: string;
  note?: string;
  user: mongoose.Types.ObjectId;
}

const ExpenseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
