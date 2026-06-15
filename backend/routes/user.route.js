import express from "express";

import {
  signupUser,
  loginUser,
  logoutUser,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";
import { addToCart, addToWishlist, getUserData, removeFromCart, removeFromWishlist, updateCartQuantity } from "../controllers/userData.controller.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protectRoute, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


router.post("/wishlist/add", protectRoute, addToWishlist);
router.delete("/wishlist/remove/:productId", protectRoute, removeFromWishlist);

router.post("/cart/add", protectRoute, addToCart);
router.post("/cart/remove", protectRoute, removeFromCart);
router.put("/cart/update", protectRoute, updateCartQuantity);

router.get("/data", protectRoute, getUserData);

export default router;
