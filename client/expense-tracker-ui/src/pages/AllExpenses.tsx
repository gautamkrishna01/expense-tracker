import React, { useState } from "react";
import {
  Receipt,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  CreditCard,
} from "lucide-react";
import Modal from "../components/Modal";
import ExpenseForm, { type ExpenseFormData } from "../components/ExpenseForm";

const AllExpenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  // Mock data
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Grocery Shopping",
      category: "Food & Drinks",
      amount: 120.5,
      date: "2024-03-20",
      paymentMethod: "Card",
      note: "Weekly groceries",
    },
    {
      id: 2,
      title: "Rent Payment",
      category: "Housing",
      amount: 1500.0,
      date: "2024-03-01",
      paymentMethod: "Wallet",
      note: "Monthly rent",
    },
    {
      id: 3,
      title: "Electric Bill",
      category: "Housing",
      amount: 85.2,
      date: "2024-03-15",
      paymentMethod: "Cash",
    },
  ]);

  const handleAddOrEdit = (data: ExpenseFormData) => {
    if (editingExpense) {
      setExpenses(
        expenses.map((e) =>
          e.id === editingExpense.id ? { ...data, id: e.id } : e
        )
      );
    } else {
      setExpenses([...expenses, { ...data, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const openEditModal = (expense: any) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Receipt className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Expenses</h1>
            <p className="text-sm text-gray-500 font-medium">
              Track and manage your spending.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Expense
        </button>
      </div>

      {/* Filters/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <Calendar className="h-4 w-4 mr-2" />
            March 2024
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">
                      {expense.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-extrabold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                      {expense.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium truncate max-w-[150px]">
                    {expense.note || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(expense)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {expenses.length === 0 && (
          <div className="p-12 text-center">
            <Receipt className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No expenses found. Start by adding one!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
      >
        <ExpenseForm
          onSubmit={handleAddOrEdit}
          initialData={editingExpense}
          buttonText={editingExpense ? "Update Expense" : "Add Expense"}
        />
      </Modal>
    </div>
  );
};

export default AllExpenses;
