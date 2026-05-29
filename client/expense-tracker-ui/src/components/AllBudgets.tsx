import React, { useState } from "react";
import {
  PieChart,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Target,
  AlertCircle,
} from "lucide-react";
import Modal from "./Modal";
import BudgetForm, { type BudgetFormData } from "./BudgetForm";

const AllBudgets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  // Mock data with userId
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      title: "Monthly Groceries",
      amount: 500.0,
      spent: 320.0,
      category: "Food",
      month: "March",
      year: 2024,
      note: "Budget for household groceries",
      userId: "user123",
    },
    {
      id: 2,
      title: "Travel Fund",
      amount: 1000.0,
      spent: 150.0,
      category: "Travel",
      month: "March",
      year: 2024,
      note: "Savings for summer trip",
      userId: "user123",
    },
  ]);

  const handleAddOrEdit = (data: BudgetFormData) => {
    if (editingBudget) {
      setBudgets(
        budgets.map((b) =>
          b.id === editingBudget.id ? { ...data, id: b.id } : b
        )
      );
    } else {
      setBudgets([...budgets, { ...data, id: Date.now(), userId: "user123" }]);
    }
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const openEditModal = (budget: any) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const deleteBudget = (id: number) => {
    setBudgets(budgets.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <PieChart className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
            <p className="text-sm text-gray-500 font-medium">
              Plan and track your spending limits.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingBudget(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const remaining = budget.amount - budget.spent;
          const percentSpent = Math.min(
            (budget.spent / budget.amount) * 100,
            100
          );
          const isOverBudget = budget.spent > budget.amount;

          return (
            <div
              key={budget.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="px-2 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wider mb-2 inline-block">
                    {budget.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">
                    {budget.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-400 font-medium mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {budget.month} {budget.year}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(budget)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Spent
                    </p>
                    <p
                      className={`text-xl font-black ${
                        isOverBudget ? "text-rose-600" : "text-gray-900"
                      }`}
                    >
                      ${budget.spent.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Remaining
                    </p>
                    <p className="text-xl font-black text-indigo-600">
                      ${remaining.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOverBudget ? "bg-rose-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase">
                    <span>Limit: ${budget.amount.toFixed(2)}</span>
                    <span>{percentSpent.toFixed(0)}% Used</span>
                  </div>
                </div>

                {isOverBudget && (
                  <div className="flex items-center p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-bold">
                    <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                    Budget limit exceeded by $
                    {(budget.spent - budget.amount).toFixed(2)}
                  </div>
                )}

                {budget.note && (
                  <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {budget.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-full bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <Target className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No budgets created yet. Start planning today!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? "Edit Budget" : "Create New Budget"}
      >
        <BudgetForm
          onSubmit={handleAddOrEdit}
          initialData={editingBudget}
          buttonText={editingBudget ? "Update Budget" : "Create Budget"}
        />
      </Modal>
    </div>
  );
};

export default AllBudgets;
