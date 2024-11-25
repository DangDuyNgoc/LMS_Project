import express from "express";
import {
  getCoursesAnalytic,
  getOrdersAnalytic,
  getUserAnalytic,
} from "../controllers/analyticsController.js";
import {
  authorizeRole,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const analyticsRoute = express.Router();

analyticsRoute.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getUserAnalytic
);

analyticsRoute.get(
  "/get-courses-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getCoursesAnalytic
);

analyticsRoute.get(
  "/get-orders-analytics",
  isAuthenticated,
  authorizeRole("admin"),
  getOrdersAnalytic
);

export default analyticsRoute;
