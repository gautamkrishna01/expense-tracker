import mongoose, { Schema, Document } from "mongoose";

export interface ISaving extends Document {
  title: string;
  amount: number;
  date: string;
  category: string;
  note?: string;
  user: mongoose.Types.ObjectId;
}

const SavingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    note: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISaving>("Saving", SavingSchema);
