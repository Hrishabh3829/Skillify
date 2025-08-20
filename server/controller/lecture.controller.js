import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title required.",
      });
    }

    // Create new lecture
    const lecture = await Lecture.create({ lectureTitle });

    // Find course and associate lecture
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found. Unable to add lecture.",
      });
    }

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Lecture created.",
      data: lecture,
    });
  } catch (error) {
    console.error("Create Lecture error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while creating the lecture.",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Oops! Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Here are your lectures, ready to dive in! 🚀",
      lectures:course.lectures,
    });
  } catch (error) {
    console.error("Get Lecture error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching lectures. Please try again.",
    });
  }
};
