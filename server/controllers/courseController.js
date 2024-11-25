import cloudinary from "cloudinary";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

import { createCourse } from "../services/courseService.js";
import coursesModel from "../models/courseModel.js";
import { sendMail } from "./../config/sendEmail.js";
import notificationModel from "../models/notificationModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// upload course
export const uploadCourse = async (req, res) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;

    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    createCourse(data, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// edit course
export const updateCourse = async (req, res) => {
  try {
    const data = req.body;

    const thumbnail = data.thumbnail;

    const courseId = req.params.id;

    const course = await coursesModel.findById(courseId);

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    if (thumbnail && !thumbnail.startsWith("https")) {
      await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });

      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    if (thumbnail.startsWith("https")) {
      data.thumbnail = {
        public_id: course?.thumbnail.public_id,
        url: course?.thumbnail.url,
      };
    }

    const courseData = await coursesModel.findByIdAndUpdate(
      courseId,
      {
        $set: data,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Updated Course Successfully",
      course: courseData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get single course
export const getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await coursesModel
      .findById(courseId)
      .select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -course.links"
      );

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Course Found",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all course
export const getAllCourse = async (req, res) => {
  try {
    const course = await coursesModel
      .find()
      .select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -course.links"
      );

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Courses Found",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCourseByUser = async (req, res) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    // the course exists in the user's course list
    const courseExists = userCourseList?.find(
      (course) => course._id.toString() === courseId
    );

    if (!courseExists) {
      return res.status(404).send({
        success: false,
        message: "You are not eligible to access this course",
      });
    }

    const course = await coursesModel.findById(courseId);
    const content = course?.courseData;

    res.status(200).send({
      success: true,
      message: "Course Found",
      content: content,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { question, courseId, courseContentId } = req.body;

    const course = await coursesModel.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(courseContentId)) {
      return res.status(401).send({
        success: false,
        message: "Invalid content id",
      });
    }

    const courseContent = course?.courseData?.find((item) =>
      item._id.equals(courseContentId)
    );

    if (!courseContent) {
      return res.status(404).send({
        success: false,
        message: "Invalid content",
      });
    }

    // create a new question
    const newQuestion = {
      user: req.user,
      question,
      questionReplies: [],
    };

    courseContent.questions.push(newQuestion);

    await notificationModel.create({
      user: req.user?._id,
      title: "New Question Received",
      message: `You have a new question in ${courseContent.title}`,
    });

    await course.save();

    res.status(200).send({
      success: true,
      message: "Question added successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addAnswer = async (req, res) => {
  try {
    const { answer, courseId, contentId, questionId } = req.body;

    const course = await coursesModel.findById(courseId);

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(401).send({
        success: false,
        message: "Invalid content id",
      });
    }

    const courseContent = course?.courseData?.find((item) =>
      item._id.equals(contentId)
    );

    if (!courseContent) {
      return res.status(404).send({
        success: false,
        message: "Invalid content",
      });
    }

    const question = courseContent?.questions?.find((item) =>
      item._id.equals(questionId)
    );

    if (!question) {
      return res.status(404).send({
        success: false,
        message: "Invalid question ID",
      });
    }

    const newAnswer = {
      user: req.user,
      answer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    question.questionReplies.push(newAnswer);

    await course.save();

    if (req.user?._id === question._id) {
      await notificationModel.create({
        user: req.user?._id,
        title: "New Question Reply Received",
        message: `You have a new question reply in ${courseContent.title}`,
      });
    } else {
      const data = {
        name: req.user.name,
        title: courseContent.title,
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mail/questionReply.ejs"),
        data
      );

      try {
        await sendMail({
          email: question.user.email,
          subject: "Question Reply",
          template: "questionReply.ejs",
          data,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Cannot send email to user",
        });
      }
    }

    res.status(200).send({
      success: true,
      message: "Answer added successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { courseId, courseContentId, questionId } = req.body;
    const course = await coursesModel.findById(courseId);

    const userId = req.user._id;

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: User ID is missing",
      });
    }

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    const courseContent = course?.courseData?.find((item) => item._id.equals(courseContentId));

    if (!courseContent) {
      return res.status(404).send({
        success: false,
        message: "Course content not found",
      });
    }

    const questionIndex = courseContent.questions.findIndex(
      (question) => question._id.toString() === questionId.toString()
    );

    if (questionIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Question not found",
      });
    }

    // check authorization 
    const question = courseContent.questions[questionIndex];

    if (question.user._id.toString() !== userId.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Only the creator can delete this question",
      });
    }

    // Remove the question
    courseContent.questions.splice(questionIndex, 1);

    await course.save();

    res.status(200).send({
      success: true,
      message: "Question deleted successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// add review
export const addReview = async (req, res) => {
  try {
    const userCourseList = req.user.courses;
    const courseId = req.params.id;

    // check if user join the course
    const courseExists = userCourseList?.some(
      (course) => course._id.toString() === courseId.toString()
    );

    if (!courseExists) {
      return res.status(400).send({
        success: false,
        message: "You are not allow access to this course",
      });
    }

    const course = await coursesModel.findById(courseId);

    const { review, rating } = req.body;

    // add review
    const reviewData = {
      user: req.user,
      rating,
      comment: review,
    };

    course?.reviews.push(reviewData);

    // calculate the average score for the course
    let avg = 0;
    course.reviews.forEach((item) => {
      avg += item.rating;
    });

    // update avg mark for the course
    if (course) {
      course.rating = avg / course.reviews.length;
    }

    await course.save();

    res.status(200).send({
      success: true,
      message: "Review Added Successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// add reply to review
export const addReplyToReview = async (req, res) => {
  try {
    const { comment, courseId, reviewId } = req.body;

    const course = await coursesModel.findById(courseId);

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    const review = course?.reviews.find(
      (item) => item._id.toString() === reviewId.toString()
    );

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    const replyData = {
      user: req.user,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!review.commentRelies) {
      review.commentRelies = [];
    }

    review.commentRelies.push(replyData);

    await course.save();

    res.status(200).send({
      success: true,
      message: "Review Added Successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete review 
export const deleteReview = async (req, res) => {
  try {
    const {courseId, reviewId} = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: User ID is missing",
      });
    }

    const course = await coursesModel.findById(courseId);

    if(!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found",
      });
    }

    // find Index of review
    const reviewIndex = course.reviews.findIndex(
      (review) => review._id.toString() === reviewId.toString()
    );

    if(reviewIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    const review = course.reviews[reviewIndex];

    // check authorization to permission delete review
    if(review.user?._id.toString() !== userId.toString()) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized: Only the creator can delete this review",
      });
    }

    // remove review
    course.reviews.splice(reviewIndex, 1);

    await course.save();

    res.status(200).send({
      success: true,
      message: "Review deleted successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// get all course for admin
export const getAllCourseAdmin = async (req, res) => {
  try {
    const course = await coursesModel.find().sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Courses Retrieved Successfully",
      courses: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await coursesModel.findById(id);

    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course Not Found",
      });
    }

    await course.deleteOne({ id });

    return res.status(200).send({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// generateVideoUrl
export const generateVideoUrl = async (req, res) => {
  try {
    const { videoId } = req.body;

    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VDOCIPHER_SECRET_KEY} `,
        },
      }
    );

    return res.status(200).send({
      success: true,
      message: "Video Url Generated Successfully",
      ...response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
