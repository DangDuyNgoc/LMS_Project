import express from "express";
import {
  activeUser,
  deleteUser,
  forgotPassword,
  getAllUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  requestPasswordReset,
  socialAuth,
  updateAccessToken,
  updateUserAvatar,
  updateUserInfo,
  updateUserPassword,
  updateUserRole,
  verifyOTP,
} from "../controllers/userController.js";
import {
  authorizeRole,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

userRoute.post("/registration", registrationUser);
userRoute.post("/activate-user", activeUser);
userRoute.post("/login-user", loginUser);
userRoute.post("/request-password-reset", requestPasswordReset);
userRoute.post("/verify-otp-reset-password", verifyOTP);
userRoute.post("/password-reset", forgotPassword);
userRoute.post("/logout", isAuthenticated, logoutUser);
userRoute.post("/refresh-token", updateAccessToken);
userRoute.get("/me", isAuthenticated, getUserInfo);
userRoute.post("/social-auth", isAuthenticated, socialAuth);
userRoute.put("/update-user", isAuthenticated, updateUserInfo);
userRoute.put("/update-password", isAuthenticated, updateUserPassword);
userRoute.put("/update-avatar", isAuthenticated, updateUserAvatar);
userRoute.get(
  "/get-users",
  isAuthenticated,
  authorizeRole("admin"),
  getAllUser
);

userRoute.put(
  "/update-user-role",
  isAuthenticated,
  authorizeRole("admin"),
  updateUserRole
);

userRoute.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRole("admin"),
  deleteUser
);


export default userRoute;
