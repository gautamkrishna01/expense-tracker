import { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import Modal from "./Modal";
import IncomeForm, { type IncomeFormData } from "./IncomeForm";
import { incomeAPI } from "../services/api";

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
  const [incomeEntries, setIncomeEntries] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const response = await incomeAPI.getAll();
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

  const totalIncome = useMemo(() => {
    return incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  }, [incomeEntries]);

  const handleAddOrEdit = async (data: IncomeFormData) => {
    setIsSubmitting(true);
    try {
      if (editingIncome) {
        const response = await incomeAPI.update(editingIncome._id, data);
        setIncomeEntries(
          incomeEntries.map((e) =>
            e._id === editingIncome._id ? response.data : e
          )
        );
        toast.success("Income updated successfully");
      } else {
        const response = await incomeAPI.create(data);
        setIncomeEntries([...incomeEntries, response.data]);
        toast.success("Income added successfully");
      }
      setIsModalOpen(false);
      setEditingIncome(null);
    } catch (error) {
      toast.error(
        editingIncome ? "Failed to update income" : "Failed to add income"
      );
      console.error("Error saving income:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (income: Income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const deleteIncome = async (id: string) => {
    try {
      await incomeAPI.delete(id);
      setIncomeEntries(incomeEntries.filter((e) => e._id !== id));
      toast.success("Income deleted successfully");
    } catch (error) {
      toast.error("Failed to delete income");
      console.error("Error deleting income:", error);
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
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Income
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              ${totalIncome.toFixed(2)}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search income..."
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
                incomeEntries.map((income) => (
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
                        +${income.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full">
                        {income.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(income.date).toLocaleDateString()}
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
                          onClick={() => deleteIncome(income._id)}
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
        {!loading && incomeEntries.length === 0 && (
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
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default AllIncome;
