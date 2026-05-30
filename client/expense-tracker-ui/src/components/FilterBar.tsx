import React from "react";
import { Search, Filter, Calendar, Coins, ArrowUpDown } from "lucide-react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  minAmount: string;
  onMinAmountChange: (value: string) => void;
  maxAmount: string;
  onMaxAmountChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  placeholder?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  selectedCategory,
  onCategoryChange,
  categories,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
  sortBy,
  onSortChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      {/* Search Bar */}
      <div className="relative flex-grow min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
        />
      </div>

      {/* Date Range */}
      <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
        <Calendar className="h-4 w-4 text-gray-400" />
        <NepaliDatePicker
          inputClassName="bg-transparent text-xs font-semibold text-gray-600 focus:outline-none w-24"
          value={startDate}
          onChange={(value: string) => onStartDateChange(value)}
          options={{ calenderType: "Nepali", format: "YYYY-MM-DD" }}
        />
        <span className="text-gray-300">-</span>
        <NepaliDatePicker
          inputClassName="bg-transparent text-xs font-semibold text-gray-600 focus:outline-none w-24"
          value={endDate}
          onChange={(value: string) => onEndDateChange(value)}
          options={{ calenderType: "Nepali", format: "YYYY-MM-DD" }}
        />
      </div>

      {/* Category */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Range */}
      <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
        <Coins className="h-4 w-4 text-gray-400" />
        <input
          type="number"
          placeholder="Min"
          value={minAmount}
          onChange={(e) => onMinAmountChange(e.target.value)}
          className="w-16 bg-transparent text-xs font-semibold text-gray-600 focus:outline-none placeholder:text-gray-300"
        />
        <span className="text-gray-300">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxAmount}
          onChange={(e) => onMaxAmountChange(e.target.value)}
          className="w-16 bg-transparent text-xs font-semibold text-gray-600 focus:outline-none placeholder:text-gray-300"
        />
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount-high">Amount (High-Low)</option>
          <option value="amount-low">Amount (Low-High)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
