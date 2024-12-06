import express from "express";
import {
  addInventory,
  updateInventory,
  getInventoryById,
} from "../controller/barang_controller.js";
import { authorize } from "../controller/auth_controller.js";

import { IsAdmin, IsMember} from "../middleware/role_validation.js";

const router = express.Router();

router.post("/inventory",authorize ,IsAdmin, addInventory);

router.put("/inventory/:id", authorize,IsAdmin, updateInventory);

router.get("/inventory/:id", getInventoryById);

export default router;
