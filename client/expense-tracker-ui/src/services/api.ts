import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put("/auth/profile", data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/password", data),
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, data: { password: string }) =>
    api.post(`/auth/reset-password/${token}`, data),
  getSettings: () => api.get("/auth/settings"),
  updateSettings: (data: {
    currency?: string;
    dateFormat?: string;
    language?: string;
    emailNotifications?: boolean;
    budgetAlerts?: boolean;
    theme?: "light" | "dark";
  }) => api.put("/auth/settings", data),
  deleteAccount: () => api.delete("/auth/account"),
};

// Transaction API (Unified)
export const transactionAPI = {
  getAll: (params: any) => api.get("/transactions", { params }),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (data: any) => api.post("/transactions", data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

// Expense API
export const expenseAPI = {
  getAll: () => api.get("/expenses"),
  getById: (id: string) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post("/expenses", data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Income API
export const incomeAPI = {
  getAll: () => api.get("/income"),
  getById: (id: string) => api.get(`/income/${id}`),
  create: (data: any) => api.post("/income", data),
  update: (id: string, data: any) => api.put(`/income/${id}`, data),
  delete: (id: string) => api.delete(`/income/${id}`),
};

// Saving API
export const savingAPI = {
  getAll: () => api.get("/savings"),
  getById: (id: string) => api.get(`/savings/${id}`),
  create: (data: any) => api.post("/savings", data),
  update: (id: string, data: any) => api.put(`/savings/${id}`, data),
  delete: (id: string) => api.delete(`/savings/${id}`),
};

// Budget API
export const budgetAPI = {
  getAll: () => api.get("/budgets"),
  getById: (id: string) => api.get(`/budgets/${id}`),
  create: (data: any) => api.post("/budgets", data),
  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get("/dashboard/summary"),
};

// Reports API
export const reportsAPI = {
  getFinancialReport: (params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get("/reports/financial", { params }),
  getCategoryReport: (params?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get("/reports/category", { params }),
  getTrendReport: (params?: { period?: string }) =>
    api.get("/reports/trend", { params }),
  getBudgetReport: () => api.get("/reports/budget"),
};

export default api;
