import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
  updateProfile,
  updatePassword,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";

const router = Router();

// Register route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  register
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  login
);

// Get current user route (protected)
router.get("/me", protect, getCurrentUser);

// Logout route
router.post("/logout", logout);

// Update profile route (protected)
router.put(
  "/profile",
  protect,
  [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  ],
  updateProfile
);

// Update password route (protected)
router.put(
  "/password",
  protect,
  [
    body("currentPassword")
      .exists()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  updatePassword
);

export default router;
