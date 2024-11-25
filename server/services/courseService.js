import coursesModel from "./../models/courseModel.js";

// create course
export const createCourse = async (data, res) => {
  try {
    const course = await coursesModel.create(data);
    res.status(200).send({
      success: true,
      message: "Course created successfully",
      course: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
