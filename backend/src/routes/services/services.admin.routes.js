import express from "express";
import { createService, updateService, deleteService } from "../../controllers/services.controller.js";
import { protect, isSuper } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, isSuper, createService);
router.put("/:id", protect, isSuper, updateService);
router.delete("/:id", protect, isSuper, deleteService);

export default router;
