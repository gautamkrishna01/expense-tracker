import * as React from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ExpenseForm, { type ExpenseFormData } from "../components/ExpenseForm";
import { transactionAPI } from "../services/api";

const AddExpense = () => {
  const navigate = useNavigate();

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      await transactionAPI.create({
        ...data,
        type: "expense",
      });
      toast.success("Expense added successfully");
      navigate("/expenses/all");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add expense";
      toast.error(errorMessage);
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <Link
          to="/expenses/all"
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 transition-all shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <PlusCircle className="h-6 w-6 text-indigo-600 mr-2" />
            Add Expense
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Create a new entry for your expenditures.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <ExpenseForm
          onSubmit={handleAddExpense}
          buttonText="Create Expense Entry"
        />
      </div>
    </div>
  );
};

export default AddExpense;
