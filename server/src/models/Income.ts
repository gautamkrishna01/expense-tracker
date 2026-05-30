import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  title: string;
  amount: number;
  date: Date;
  source: string;
  note?: string;
  user: mongoose.Types.ObjectId;
}

const IncomeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    source: { type: String, required: true },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IIncome>("Income", IncomeSchema);
