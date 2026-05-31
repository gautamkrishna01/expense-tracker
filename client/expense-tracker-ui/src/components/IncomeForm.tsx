import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { UserContext } from "../App";
import { CURRENCIES } from "../constants";

export interface IncomeFormData {
  title: string;
  amount: number;
  source: string;
  date: string;
  note?: string;
  userId?: string; // Assuming userId might be passed or derived
}

interface IncomeFormProps {
  onSubmit: (data: IncomeFormData) => void;
  initialData?: IncomeFormData;
  buttonText?: string;
  isLoading?: boolean;
}

const IncomeForm = ({
  onSubmit,
  initialData,
  buttonText = "Save Income",
  isLoading = false,
}: IncomeFormProps) => {
  const userContext = useContext(UserContext);
  const currencyCode = userContext?.user?.settings?.currency || "USD";
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currencyCode)?.symbol || "$";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IncomeFormData>({
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      amount: 0,
      source: "Salary",
      date: "",
      note: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Income Title
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="e.g., Monthly Salary"
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
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm font-bold">
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
              className={`block w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
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

        {/* Source */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Source
          </label>
          <select
            {...register("source", { required: "Source is required" })}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investments">Investments</option>
            <option value="Gift">Gift</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Date
        </label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <NepaliDatePicker
              inputClassName={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.date ? "border-red-500 ring-2 ring-red-500/10" : ""
              }`}
              value={field.value}
              onChange={(value: string) => field.onChange(value)}
              options={{ calenderType: "Nepali", format: "YYYY-MM-DD" }}
            />
          )}
        />
        {errors.date && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Note (Optional)
        </label>
        <textarea
          {...register("note")}
          rows={3}
          placeholder="Add some details..."
          className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
};

export default IncomeForm;
