import * as React from "react";
import { PlusCircle, ArrowLeft, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import IncomeForm, { type IncomeFormData } from "../components/IncomeForm";
import { transactionAPI } from "../services/api";

const AddIncome = () => {
  const navigate = useNavigate();

  const handleAddIncome = async (data: IncomeFormData) => {
    try {
      await transactionAPI.create({
        ...data,
        type: "income",
        category: data.source, // Map source to category for Transaction model
      });
      toast.success("Income added successfully");
      navigate("/income/all");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add income";
      toast.error(errorMessage);
      console.error("Error adding income:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <Link
          to="/income/all"
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Wallet className="h-6 w-6 text-indigo-600 mr-2" />
            Add Income
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Create a new entry for your income.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <IncomeForm
          onSubmit={handleAddIncome}
          buttonText="Create Income Entry"
        />
      </div>
    </div>
  );
};

export default AddIncome;
