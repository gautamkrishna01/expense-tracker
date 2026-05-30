import { useState, useEffect, useMemo, useContext } from "react";
import { PiggyBank, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import SavingForm, { type SavingFormData } from "../components/SavingForm";
import FilterBar from "../components/FilterBar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { savingAPI } from "../services/api";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

const CATEGORIES = [
  "Emergency Fund",
  "Retirement",
  "Investment",
  "Travel",
  "Education",
  "Other",
];

interface Saving {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

const AllSavings = () => {
  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const userContext = useContext(UserContext);
  const currencySymbol =
    CURRENCIES.find((c) => c.code === userContext?.user?.settings?.currency)
      ?.symbol || "$";

  const fetchSavings = async () => {
    setLoading(true);
    try {
      const res = await savingAPI.getAll();
      setSavings(res.data);
    } catch (err) {
      toast.error("Failed to load savings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  const filtered = useMemo(() => {
    return savings
      .filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCat === "All" || s.category === selectedCat) &&
          (!startDate || s.date >= startDate) &&
          (!endDate || s.date <= endDate)
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [savings, searchTerm, selectedCat, startDate, endDate]);

  const total = useMemo(
    () => filtered.reduce((sum, s) => sum + s.amount, 0),
    [filtered]
  );

  const handleAddEdit = async (data: SavingFormData) => {
    try {
      if (editingSaving) {
        const res = await savingAPI.update(editingSaving._id, data);
        setSavings(
          savings.map((s) => (s._id === editingSaving._id ? res.data : s))
        );
        toast.success("Saving updated successfully");
      } else {
        const res = await savingAPI.create(data);
        setSavings([...savings, res.data]);
        toast.success("Saving added successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        (editingSaving ? "Failed to update saving" : "Failed to add saving");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <PiggyBank className="h-6 w-6 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Savings
          </h1>
        </div>
        <button
          onClick={() => {
            setEditingSaving(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold"
        >
          Add Saving
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p className="text-xs font-bold text-gray-400 uppercase">
          Total Savings
        </p>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
          {currencySymbol} {total.toFixed(2)}
        </h3>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        selectedCategory={selectedCat}
        onCategoryChange={setSelectedCat}
        categories={CATEGORIES}
        minAmount=""
        onMinAmountChange={() => {}}
        maxAmount=""
        onMaxAmountChange={() => {}}
        sortBy="newest"
        onSortChange={() => {}}
      />

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : (
              filtered.map((saving) => (
                <tr
                  key={saving._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    {saving.title}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-amber-600">
                    {currencySymbol} {saving.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 rounded-full">
                      {saving.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {saving.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingSaving(saving);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-indigo-600"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(saving._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1 text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSaving ? "Edit Saving" : "Add Saving"}
      >
        <SavingForm
          onSubmit={handleAddEdit}
          initialData={editingSaving || undefined}
          buttonText={editingSaving ? "Update Entry" : "Create Entry"}
        />
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await savingAPI.delete(deleteId);
            setSavings(savings.filter((s) => s._id !== deleteId));
            toast.success("Saving deleted successfully");
          } catch (err: any) {
            const errorMessage =
              err.response?.data?.message || "Failed to delete saving";
            toast.error(errorMessage);
          }
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default AllSavings;
