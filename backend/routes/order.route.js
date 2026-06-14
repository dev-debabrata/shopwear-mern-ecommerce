import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/my-orders", protectRoute, getMyOrders);
router.get("/admin/all", protectRoute, getAllOrders);
router.put("/admin/status/:id", protectRoute, updateOrderStatus);

export default router;