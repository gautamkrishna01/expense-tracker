import { useState, useEffect, useMemo, useContext } from "react";
import { Receipt, Edit3, Trash2, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import ExpenseForm, { type ExpenseFormData } from "../components/ExpenseForm";
import FilterBar from "../components/FilterBar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Pagination from "../components/Pagination";
import { transactionAPI } from "../services/api";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

const CATEGORIES = [
  "Food & Drinks",
  "Housing",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health",
  "Other",
];
const NEPALI_MONTHS = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangshir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  note?: string;
}

const AllExpenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseToDeleteId, setExpenseToDeleteId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const userContext = useContext(UserContext);
  const currencyCode = userContext?.user?.settings?.currency || "USD";
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "$";

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getAll({
        type: "expense",
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        category: selectedCategory,
        month: selectedMonth,
        startDate,
        endDate,
        sortBy,
      });
      setExpenses(response.data.data);
      setGrandTotal(response.data.totalAmount);
      setTotalPages(response.data.pagination.pages);
      setTotalResults(response.data.pagination.total);
    } catch (error) {
      toast.error("Failed to fetch expenses");
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    selectedMonth,
    startDate,
    endDate,
    sortBy,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, startDate, endDate, selectedMonth, sortBy]);

  const startItem =
    totalResults === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalResults);

  const handleAddOrEdit = async (data: ExpenseFormData) => {
    try {
      if (editingExpense) {
        const response = await transactionAPI.update(editingExpense._id, {
          ...data,
          type: "expense",
        });
        setExpenses(
          expenses.map((e) =>
            e._id === editingExpense._id ? response.data : e
          )
        );
        toast.success("Expense updated successfully");
      } else {
        const response = await transactionAPI.create({
          ...data,
          type: "expense",
        });
        setExpenses([...expenses, response.data]);
        toast.success("Expense added successfully");
      }
      setIsModalOpen(false);
      setEditingExpense(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (editingExpense ? "Failed to update expense" : "Failed to add expense");
      toast.error(errorMessage);
      console.error("Error saving expense:", error);
    }
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setExpenseToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDeleteId) return;
    setIsDeleting(true);
    try {
      await transactionAPI.delete(expenseToDeleteId);
      setExpenses(expenses.filter((e) => e._id !== expenseToDeleteId));
      toast.success("Expense deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete expense";
      toast.error(errorMessage);
      console.error("Error deleting expense:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setExpenseToDeleteId(null);
    }
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

      {/* Total Expense Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-rose-100 rounded-xl shadow-inner">
            <Receipt className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Expense
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {currencySymbol} {grandTotal.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters/Search Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        sortBy={sortBy}
        onSortChange={setSortBy}
        placeholder="Search expenses..."
      />

      {/* Result Summary */}
      <div className="flex items-center px-1">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Showing{" "}
          <span className="text-gray-900 dark:text-white">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="text-gray-900 dark:text-white">{totalResults}</span>{" "}
          Results
        </p>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-500">Loading expenses...</div>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr
                    key={expense._id}
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
                        {currencySymbol} {expense.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {expense.date.split("T")[0]}
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
                          onClick={() => handleDeleteClick(expense._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {!loading && expenses.length === 0 && (
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
          initialData={editingExpense || undefined}
          buttonText={editingExpense ? "Update Expense" : "Add Expense"}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </div>
  );
};

export default AllExpenses;
