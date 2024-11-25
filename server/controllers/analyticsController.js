import { yearData } from "../config/analyticData.js";
import userModel from "../models/userModel.js";
import coursesModel from "./../models/courseModel.js";
import orderModel from "./../models/orderModel.js";

// get user analytics
export const getUserAnalytic = async (req, res) => {
  try {
    const users = await yearData(userModel);

    return res.status(200).send({
      success: true,
      message: "Get user Analytics Successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// get courses analytics
export const getCoursesAnalytic = async (req, res) => {
  try {
    const courses = await yearData(coursesModel);

    return res.status(200).send({
      success: true,
      message: "Get Courses Analytics Successfully",
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// get orders analytics
export const getOrdersAnalytic = async (req, res) => {
  try {
    const orders = await yearData(orderModel);

    return res.status(200).send({
      success: true,
      message: "Get Orders Analytics Successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
