import userModel from "./../models/userModel.js";
import coursesModel from "./../models/courseModel.js";
import notificationModel from "./../models/notificationModel.js";
import { newOrder } from "../services/orderService.js";
import { sendMail } from "../config/sendEmail.js";
import orderModel from "../models/orderModel.js";

import ejs from "ejs";
import path from "path";
import Stripe from "stripe";
import { fileURLToPath } from "url";
import { config } from "../config/config.js";

console.log("STRIPE_SECRET_KEY:", config.STRIPE_SECRET_KEY);

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = async (req, res) => {
  try {
    const { courseId, paymentInfo } = req.body;

    // if(paymentInfo) {
    //   const paymentIntentId = paymentInfo.id;
    //   console.log("paymentIntentId:", paymentIntentId);
    //   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //   if(paymentIntent.status !== "succeeded") {
    //     return res.status(400).send({
    //       success: false,
    //       message: "Payment was not successful",
    //     });
    //   }
    // }

    const user = await userModel.findById(req.user?._id);

    const courseExistInUser = user?.courses.some(
      (item) => item._id.toString() === courseId
    );

    if (courseExistInUser) {
      return res.status(401).send({
        status: false,
        message: "You have already purchased this course",
      });
    }

    const course = await coursesModel.findById(courseId);

    if (!course) {
      return res.status(404).send({
        status: false,
        message: "Course not found",
      });
    }

    const data = {
      userId: user?._id,
      courseId: course?._id,
      paymentInfo,
    };

    const mailData = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        data: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mail/orderConfirm.ejs"),
      { order: mailData }
    );

    try {
      if (user) {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "orderConfirm.ejs",
          data: mailData,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "Error In sendMail",
      });
    }

    user?.courses.push(course?._id);

    await user.save();

    await notificationModel.create({
      user: user._id,
      title: "New Order",
      message: `You have new order from ${course.name}`,
    });

    course.purchased = course.purchased + 1;

    await course.save();

    await newOrder(data, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all orders
export const getAllOrder = async (req, res) => {
  try {
    const order = await orderModel.find().sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Orders found",
      order: order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const sendStripePublishableKey = async (req, res) => {
  try {
    const publishableKey = config.STRIPE_PUBLIC_KEY;
    if (!publishableKey) {
      return res.status(500).send({
        success: false,
        message: "Publishable key is missing",
      });
    }
    return res.status(200).send({
      success: true,
      publishableKey,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// new payment
export const newPayment = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "usd",
      metadata: {
        company: "E-Learning",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).send({
      success: true,
      message: "Payment successful",
      paymentIntent: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
