import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import incomeRoutes from "./routes/incomeRoutes";
import budgetRoutes from "./routes/budgetRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budgets", budgetRoutes);

app.get("/", (req, res) => res.send("Expense Tracker API is running..."));

export default app;
