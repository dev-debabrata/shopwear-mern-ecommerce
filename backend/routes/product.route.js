import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductField,
  deleteProduct,
} from "../controllers/product.controller.js";

import upload from "../middlewares/upload.js";
import { protectAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post(
  "/",
  protectAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  createProduct,
);

router.get("/", getProducts);
router.get("/:id", getProductById);

router.put(
  "/:id",
  protectAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
);

router.patch("/:id", protectAdmin, updateProductField);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;
