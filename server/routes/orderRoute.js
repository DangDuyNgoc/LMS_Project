import express from "express";
import {
  authorizeRole,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getAllOrder,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/create-order", isAuthenticated, createOrder);

orderRoute.get(
  "/get-orders",
  isAuthenticated,
  authorizeRole("admin"),
  getAllOrder
);

orderRoute.get("/payment/publishable-key", sendStripePublishableKey);

orderRoute.post("/payment", isAuthenticated, newPayment);

export default orderRoute;
