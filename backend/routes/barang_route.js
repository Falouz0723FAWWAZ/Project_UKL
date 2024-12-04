import express from "express";
import {
  addInventory,
  updateInventory,
  getInventoryById,
} from "../controller/barang_controller.js";

const router = express.Router();

router.post("/inventory", addInventory);

router.put("/inventory/:id", updateInventory);

router.get("/inventory/:id", getInventoryById);

export default router;
