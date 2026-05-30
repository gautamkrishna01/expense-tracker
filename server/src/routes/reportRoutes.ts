import { Router } from "express";
import {
  getFinancialReport,
  getCategoryReport,
  getTrendReport,
  getBudgetReport,
} from "../controllers/reportController.js";

const router = Router();

router.get("/financial", getFinancialReport);
router.get("/category", getCategoryReport);
router.get("/trend", getTrendReport);
router.get("/budget", getBudgetReport);

export default router;
