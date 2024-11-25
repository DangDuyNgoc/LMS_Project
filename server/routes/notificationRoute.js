import express from "express";
import {
  authorizeRole,
  isAuthenticated,
} from "./../middlewares/authMiddleware.js";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizeRole("admin"),
  getNotifications
);

notificationRoute.put(
  "/update-notification/:id",
  isAuthenticated,
  authorizeRole("admin"),
  updateNotification
);

export default notificationRoute;
