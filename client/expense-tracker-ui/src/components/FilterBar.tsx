import React from "react";
import {
  Search,
  Filter,
  Calendar,
  CalendarDays,
  ArrowUpDown,
} from "lucide-react";
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
  selectedMonth: string;
  onMonthChange: (value: string) => void;
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
  selectedMonth,
  onMonthChange,
  sortBy,
  onSortChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
      {/* Search Bar */}
      <div className="relative flex-grow min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all text-sm"
        />
      </div>

      {/* From Date */}
      <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 transition-colors duration-200">
        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
          From
        </span>
        <NepaliDatePicker
          inputClassName="bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 focus:outline-none w-24"
          value={startDate}
          onChange={(value: string) => onStartDateChange(value)}
          options={{ calenderType: "Nepali", format: "YYYY-MM-DD" }}
        />
      </div>

      {/* To Date */}
      <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 transition-colors duration-200">
        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">
          To
        </span>
        <NepaliDatePicker
          inputClassName="bg-transparent text-xs font-semibold text-gray-600 dark:text-gray-300 focus:outline-none w-24"
          value={endDate}
          onChange={(value: string) => onEndDateChange(value)}
          options={{ calenderType: "Nepali", format: "YYYY-MM-DD" }}
        />
      </div>

      {/* Category */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Month Filter */}
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Months</option>
          <option value="Baisakh">Baisakh</option>
          <option value="Jestha">Jestha</option>
          <option value="Ashadh">Ashadh</option>
          <option value="Shrawan">Shrawan</option>
          <option value="Bhadra">Bhadra</option>
          <option value="Ashwin">Ashwin</option>
          <option value="Kartik">Kartik</option>
          <option value="Mangshir">Mangshir</option>
          <option value="Poush">Poush</option>
          <option value="Magh">Magh</option>
          <option value="Falgun">Falgun</option>
          <option value="Chaitra">Chaitra</option>
        </select>
      </div>

      {/* Sort */}
      <div className="relative">
        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition-all appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
