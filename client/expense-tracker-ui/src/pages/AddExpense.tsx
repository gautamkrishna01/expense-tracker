import * as React from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ExpenseForm, { type ExpenseFormData } from "../components/ExpenseForm";

const AddExpense = () => {
  const navigate = useNavigate();

  const handleAddExpense = (data: ExpenseFormData) => {
    console.log("Adding new expense:", data);
    // In a real app, you would send this to an API
    navigate("/expenses/all");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <Link
          to="/expenses/all"
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <PlusCircle className="h-6 w-6 text-indigo-600 mr-2" />
            Add Expense
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Create a new entry for your expenditures.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <ExpenseForm
          onSubmit={handleAddExpense}
          buttonText="Create Expense Entry"
        />
      </div>
    </div>
  );
};

export default AddExpense;
