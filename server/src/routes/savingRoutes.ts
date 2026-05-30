import { Router } from "express";
import {
  getSavings,
  getSavingById,
  createSaving,
  updateSaving,
  deleteSaving,
} from "../controllers/savingController";

const router = Router();

router.get("/", getSavings);
router.get("/:id", getSavingById);
router.post("/", createSaving);
router.put("/:id", updateSaving);
router.delete("/:id", deleteSaving);

export default router;
