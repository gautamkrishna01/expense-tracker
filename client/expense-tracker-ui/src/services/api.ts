import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

// Budget API
export const budgetAPI = {
  getAll: () => api.get("/budgets"),
  getById: (id: string) => api.get(`/budgets/${id}`),
  create: (data: any) => api.post("/budgets", data),
  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};

export default api;
