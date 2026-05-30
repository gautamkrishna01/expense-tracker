import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

export interface SavingFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface SavingFormProps {
  onSubmit: (data: SavingFormData) => void;
  initialData?: SavingFormData;
  buttonText?: string;
}

const CATEGORIES = [
  "Emergency Fund",
  "Retirement",
  "Investment",
  "Travel",
  "Education",
  "Other",
];

const SavingForm = ({
  onSubmit,
  initialData,
  buttonText = "Save Entry",
}: SavingFormProps) => {
  const userContext = useContext(UserContext);
  const currencySymbol =
    CURRENCIES.find((c) => c.code === userContext?.user?.settings?.currency)
      ?.symbol || "$";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SavingFormData>({
    defaultValues: initialData || {
      title: "",
      amount: 0,
      category: "Emergency Fund",
      date: "",
      note: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="e.g., Emergency Fund"
          className={`block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all sm:text-sm ${
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            {...register("category", { required: true })}
            className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all sm:text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 font-bold sm:text-sm">
                {currencySymbol}
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              })}
              className={`block w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all sm:text-sm ${
                errors.amount ? "border-red-500 ring-2 ring-red-500/10" : ""
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">
              {errors.amount.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <NepaliDatePicker
              inputClassName="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all sm:text-sm"
              value={field.value}
              onChange={(value: string) => field.onChange(value)}
              options={{ calenderType: "Nepali", format: "YYYY-MM-DD" }}
            />
          )}
        />
        {errors.date && (
          <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Note (Optional)
        </label>
        <textarea
          {...register("note")}
          rows={2}
          className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default SavingForm;
