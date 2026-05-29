import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  title: string;
  amount: number;
  date: Date;
  category: string;
  description?: string;
}

const IncomeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IIncome>("Income", IncomeSchema);
