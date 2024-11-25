import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  deleteQuestion,
  deleteReview,
  generateVideoUrl,
  getAllCourse,
  getAllCourseAdmin,
  getCourseByUser,
  getSingleCourse,
  updateCourse,
  uploadCourse,
} from "../controllers/courseController.js";
import {
  authorizeRole,
  isAuthenticated,
} from "../middlewares/authMiddleware.js";

const courseRoute = express.Router();

courseRoute.post(
  "/create-course",
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse
);

courseRoute.put(
  "/update-course/:id",
  isAuthenticated,
  authorizeRole("admin"),
  updateCourse
);

courseRoute.get("/get-course/:id", getSingleCourse);

courseRoute.get("/get-courses", getAllCourse);

courseRoute.get("/get-course-content/:id", isAuthenticated, getCourseByUser);

courseRoute.post("/add-question", isAuthenticated, addQuestion);

courseRoute.post("/add-answer", isAuthenticated, addAnswer);

courseRoute.delete("/delete-question", isAuthenticated, deleteQuestion);

courseRoute.delete("/delete-review", isAuthenticated, deleteReview);

courseRoute.post("/add-review/:id", isAuthenticated, addReview);

courseRoute.post("/add-reply", isAuthenticated, addReplyToReview);

courseRoute.get(
  "/get-admin-all-courses",
  isAuthenticated,
  authorizeRole("admin"),
  getAllCourseAdmin
);

courseRoute.delete(
  "/delete-course/:id",
  isAuthenticated,
  authorizeRole("admin"),
  deleteCourse
);

courseRoute.post("/getVdoCipherOTP", generateVideoUrl)

export default courseRoute;
