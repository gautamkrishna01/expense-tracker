import { useState, useEffect, useMemo, useContext } from "react";
import { Wallet, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import IncomeForm, { type IncomeFormData } from "../components/IncomeForm";
import FilterBar from "../components/FilterBar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { transactionAPI } from "../services/api";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

const SOURCES = ["Salary", "Freelance", "Investments", "Gift", "Other"];

interface Income {
  _id: string;
  title: string;
  amount: number;
  source: string;
  date: string;
  note?: string;
  userId?: string;
}

const AllIncome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeToDeleteId, setIncomeToDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [incomeEntries, setIncomeEntries] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userContext = useContext(UserContext);
  const currencyCode = userContext?.user?.settings?.currency || "USD";
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "$";

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getAll("income");
      setIncomeEntries(response.data);
    } catch (error) {
      toast.error("Failed to fetch incomes");
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const filteredIncome = useMemo(() => {
    const result = incomeEntries.filter((entry) => {
      const matchesSearch = entry.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSource =
        selectedSource === "All" || entry.source === selectedSource;
      const matchesStartDate = !startDate || entry.date >= startDate;
      const matchesEndDate = !endDate || entry.date <= endDate;
      const matchesMinAmount =
        !minAmount || entry.amount >= parseFloat(minAmount);
      const matchesMaxAmount =
        !maxAmount || entry.amount <= parseFloat(maxAmount);
      return (
        matchesSearch &&
        matchesSource &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinAmount &&
        matchesMaxAmount
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "newest") return b.date.localeCompare(a.date);
      if (sortBy === "oldest") return a.date.localeCompare(b.date);
      if (sortBy === "amount-high") return b.amount - a.amount;
      if (sortBy === "amount-low") return a.amount - b.amount;
      return 0;
    });
  }, [
    incomeEntries,
    searchTerm,
    selectedSource,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy,
  ]);

  const totalIncome = useMemo(() => {
    return filteredIncome.reduce((sum, entry) => sum + entry.amount, 0);
  }, [filteredIncome]);

  const handleAddOrEdit = async (data: IncomeFormData) => {
    try {
      if (editingIncome) {
        const response = await transactionAPI.update(editingIncome._id, {
          ...data,
          type: "income",
          category: data.source, // Map source to category for Transaction model
        });
        setIncomeEntries(
          incomeEntries.map((e) =>
            e._id === editingIncome._id ? response.data : e
          )
        );
        toast.success("Income updated successfully");
      } else {
        const response = await transactionAPI.create({
          ...data,
          type: "income",
          category: data.source, // Map source to category for Transaction model
        });
        setIncomeEntries([...incomeEntries, response.data]);
        toast.success("Income added successfully");
      }
      setIsModalOpen(false);
      setEditingIncome(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (editingIncome ? "Failed to update income" : "Failed to add income");
      toast.error(errorMessage);
      console.error("Error saving income:", error);
    }
  };

  const openEditModal = (income: Income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setIncomeToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!incomeToDeleteId) return;
    setIsDeleting(true);
    try {
      await transactionAPI.delete(incomeToDeleteId);
      setIncomeEntries(incomeEntries.filter((e) => e._id !== incomeToDeleteId));
      toast.success("Income deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete income";
      toast.error(errorMessage);
      console.error("Error deleting income:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setIncomeToDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Wallet className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Income</h1>
            <p className="text-sm text-gray-500 font-medium">
              Manage your incoming funds.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingIncome(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Income
        </button>
      </div>

      {/* Total Income Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-xl shadow-inner">
            <Wallet className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Income
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {currencySymbol} {totalIncome.toFixed(2)}
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
        selectedCategory={selectedSource}
        onCategoryChange={setSelectedSource}
        categories={SOURCES}
        minAmount={minAmount}
        onMinAmountChange={setMinAmount}
        maxAmount={maxAmount}
        onMaxAmountChange={setMaxAmount}
        sortBy={sortBy}
        onSortChange={setSortBy}
        placeholder="Search income..."
      />

      {/* Income Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
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
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      Loading income entries...
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncome.map((income) => (
                  <tr
                    key={income._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        {income.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-extrabold text-emerald-600">
                        +{currencySymbol} {income.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full">
                        {income.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {income.date.split("T")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium truncate max-w-[150px]">
                      {income.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(income)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(income._id)}
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
        {!loading && filteredIncome.length === 0 && (
          <div className="p-12 text-center">
            <Wallet className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No income entries found. Add your first income!
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIncome(null);
        }}
        title={editingIncome ? "Edit Income" : "Add New Income"}
      >
        <IncomeForm
          onSubmit={handleAddOrEdit}
          initialData={editingIncome || undefined}
          buttonText={editingIncome ? "Update Income" : "Add Income"}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        title="Delete Income"
        message="Are you sure you want to delete this income entry? This action cannot be undone."
      />
    </div>
  );
};

export default AllIncome;
