import express from "express";
import { fetchServices, fetchServiceById } from "../../controllers/services.controller.js";

const router = express.Router();

router.get("/", fetchServices);
router.get("/id/:id", fetchServiceById);

export default router;
