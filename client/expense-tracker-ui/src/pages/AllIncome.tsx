import React, { useState, useMemo } from "react";
import {
  Wallet,
  Search,
  Filter,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react";
import Modal from "../components/Modal";
import IncomeForm, { type IncomeFormData } from "../components/IncomeForm";
import FilterBar from "../components/FilterBar";

const SOURCES = ["Salary", "Freelance", "Investments", "Gift", "Other"];

const AllIncome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Mock data
  const [incomeEntries, setIncomeEntries] = useState([
    {
      id: 1,
      title: "Monthly Salary",
      amount: 3500.0,
      source: "Salary",
      date: "2024-03-25",
      note: "March salary payment",
      userId: "user123",
    },
    {
      id: 2,
      title: "Freelance Project",
      amount: 750.0,
      source: "Freelance",
      date: "2024-03-18",
      note: "Web development project for client A",
      userId: "user123",
    },
    {
      id: 3,
      title: "Investment Dividend",
      amount: 150.0,
      source: "Investments",
      date: "2024-03-10",
      note: "Quarterly dividend from stocks",
      userId: "user123",
    },
  ]);

  const filteredIncome = useMemo(() => {
    let result = incomeEntries.filter((entry) => {
      const matchesSearch = entry.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSource =
        selectedSource === "All" || entry.source === selectedSource;
      const matchesStartDate =
        !startDate || new Date(entry.date) >= new Date(startDate);
      const matchesEndDate =
        !endDate || new Date(entry.date) <= new Date(endDate);
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
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
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

  const handleAddOrEdit = (data: IncomeFormData) => {
    if (editingIncome) {
      setIncomeEntries(
        incomeEntries.map((e) =>
          e.id === editingIncome.id ? { ...data, id: e.id } : e
        )
      );
    } else {
      setIncomeEntries([...incomeEntries, { ...data, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  const openEditModal = (income: any) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const deleteIncome = (id: number) => {
    setIncomeEntries(incomeEntries.filter((e) => e.id !== id));
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
              {filteredIncome.map((income) => (
                <tr
                  key={income.id}
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
                    {income.date}
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
                        onClick={() => deleteIncome(income.id)}
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
        {filteredIncome.length === 0 && (
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
          initialData={editingIncome}
          buttonText={editingIncome ? "Update Income" : "Add Income"}
        />
      </Modal>
    </div>
  );
};

export default AllIncome;
