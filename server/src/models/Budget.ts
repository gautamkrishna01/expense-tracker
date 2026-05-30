import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  title: string;
  amount: number;
  date: Date;
  category: string;
  description?: string;
  user: mongoose.Types.ObjectId;
}

const BudgetSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", BudgetSchema);
