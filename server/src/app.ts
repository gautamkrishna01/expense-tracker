import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Matches your Vite frontend port
    credentials: true, // Allows the browser to send and receive cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Define Routes with protection
app.use("/api/expenses", protect, expenseRoutes);
app.use("/api/income", protect, incomeRoutes);
app.use("/api/budgets", protect, budgetRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/reports", protect, reportRoutes);

app.get("/", (req, res) => res.send("Expense Tracker API is running..."));

export default app;
