import express from "express";
import { getDashboardStats, markMessageAsRead } from "../controllers/dashboard.controller.js";

const dashboardAdminRouter = express.Router();

dashboardAdminRouter.get("/stats", getDashboardStats);
dashboardAdminRouter.patch("/messages/:id/read", markMessageAsRead);

export default dashboardAdminRouter;
