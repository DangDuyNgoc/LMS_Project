import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const SignAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

export const SignRefreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

export const isAuthenticated = async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return res.status(401).send({
        success: false,
        message: "Please login to access this resource",
      });
    }

    // Decode the token to get user information
    const decoded = jwt.decode(access_token);
    if (!decoded) {
      return res.status(400).send({
        success: false,
        message: "Invalid access token",
      });
    }

    // get user information from database based ID
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    // save user information in request to use
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// validate user role
export const authorizeRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user?.role) || "") {
      return res.status(401).send({
        success: false,
        message: `Role: ${req.user.role} is not allowed to access this resource`,
      });
    }
    next();
  };
};
