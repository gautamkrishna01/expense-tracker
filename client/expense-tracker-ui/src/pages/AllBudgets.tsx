import { useState, useEffect, useMemo, useContext } from "react";
import {
  PieChart,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Target,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import BudgetForm, { type BudgetFormData } from "../components/BudgetForm";
import FilterBar from "../components/FilterBar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import Pagination from "../components/Pagination";
import { budgetAPI } from "../services/api";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Housing",
  "Entertainment",
  "Health",
  "Other",
];

interface Budget {
  _id: string;
  title: string;
  amount: number;
  spent: number;
  category: string;
  month: string;
  year: number;
  note?: string;
  userId?: string;
}

const AllBudgets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDeleteId, setBudgetToDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const ITEMS_PER_PAGE = 6;

  const userContext = useContext(UserContext);
  const currencyCode = userContext?.user?.settings?.currency || "USD";
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "$";

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await budgetAPI.getAll({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        category: selectedCategory,
        month: selectedMonth,
        sortBy,
      });
      setBudgets(response.data.data);
      setGrandTotal(response.data.totalAmount);
      setTotalPages(response.data.pagination.pages);
      setTotalResults(response.data.pagination.total);
    } catch (error) {
      toast.error("Failed to fetch budgets");
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [currentPage, searchTerm, selectedCategory, selectedMonth, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedMonth]);

  const startItem =
    totalResults === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalResults);

  const handleAddOrEdit = async (data: BudgetFormData) => {
    try {
      if (editingBudget) {
        const response = await budgetAPI.update(editingBudget._id, data);
        setBudgets(
          budgets.map((b) => (b._id === editingBudget._id ? response.data : b))
        );
        toast.success("Budget updated successfully");
      } else {
        const response = await budgetAPI.create(data);
        setBudgets([...budgets, response.data]);
        toast.success("Budget added successfully");
      }
      setIsModalOpen(false);
      setEditingBudget(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (editingBudget ? "Failed to update budget" : "Failed to add budget");
      toast.error(errorMessage);
      console.error("Error saving budget:", error);
    }
  };

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBudgetToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDeleteId) return;
    setIsDeleting(true);
    try {
      await budgetAPI.delete(budgetToDeleteId);
      setBudgets(budgets.filter((b) => b._id !== budgetToDeleteId));
      toast.success("Budget deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete budget";
      toast.error(errorMessage);
      console.error("Error deleting budget:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setBudgetToDeleteId(null);
    }
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

      {/* Total Budgeted Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-xl shadow-inner">
            <Target className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Budgeted
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {currencySymbol} {grandTotal.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

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
        placeholder="Search budgets..."
      />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-gray-500">Loading budgets...</div>
          </div>
        ) : (
          budgets.map((budget) => {
            const remaining = budget.amount - budget.spent;
            const percentSpent = Math.min(
              (budget.spent / budget.amount) * 100,
              100
            );
            const isOverBudget = budget.spent > budget.amount;

            return (
              <div
                key={budget._id}
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
                      onClick={() => handleDeleteClick(budget._id)}
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
                        {currencySymbol} {budget.spent.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Remaining
                      </p>
                      <p className="text-xl font-black text-indigo-600">
                        {currencySymbol} {remaining.toFixed(2)}
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
                      <span>
                        Limit: {currencySymbol} {budget.amount.toFixed(2)}
                      </span>
                      <span>{percentSpent.toFixed(0)}% Used</span>
                    </div>
                  </div>

                  {isOverBudget && (
                    <div className="flex items-center p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-bold">
                      <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                      Budget limit exceeded by {currencySymbol}{" "}
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
          })
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {!loading && budgets.length === 0 && (
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
          initialData={editingBudget || undefined}
          buttonText={editingBudget ? "Update Budget" : "Create Budget"}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? You will lose track of your progress for this category."
      />
    </div>
  );
};

export default AllBudgets;
