import { Router } from "express";
import {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/incomeController";

const router = Router();

router.get("/", getIncomes);
router.get("/:id", getIncomeById);
router.post("/", createIncome);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

export default router;
