import * as React from "react";
import { useForm } from "react-hook-form";

export interface BudgetFormData {
  title: string;
  amount: number;
  spent: number;
  category: string;
  month: string;
  year: number;
  note?: string;
  userId?: string;
}

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  initialData?: BudgetFormData;
  buttonText?: string;
}

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Housing",
  "Entertainment",
  "Health",
  "Other",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [2024, 2025, 2026];

const BudgetForm = ({
  onSubmit,
  initialData,
  buttonText = "Save Budget",
}: BudgetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      amount: 0,
      spent: 0,
      category: "Food",
      month: months[new Date().getMonth()],
      year: new Date().getFullYear(),
      note: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Budget Name
        </label>
        <input
          {...register("title", { required: "Budget name is required" })}
          placeholder="e.g., Monthly Grocery Budget"
          className={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            errors.title ? "border-red-500 ring-2 ring-red-500/10" : ""
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Total Limit
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount", { required: "Amount is required", min: 0 })}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Spent */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Already Spent
          </label>
          <input
            type="number"
            step="0.01"
            {...register("spent", { min: 0 })}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register("category", { required: "Category is required" })}
          className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Month */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Month
          </label>
          <select
            {...register("month", { required: "Month is required" })}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Year
          </label>
          <select
            {...register("year", {
              required: "Year is required",
              valueAsNumber: true,
            })}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Note (Optional)
        </label>
        <textarea
          {...register("note")}
          rows={2}
          placeholder="Describe your budget goal..."
          className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md shadow-indigo-200"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default BudgetForm;
