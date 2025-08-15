import { Course } from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required.",
      });
    }

    const course = await Course.create({
      courseTitle: courseTitle.trim(),
      category: category.trim(),
      creator: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Course created.",
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course.",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId=req.id
    const courses=await Course.find({creator:userId})
    if(!courses){
      return res.status(404).json({
        courses:[],
        message:"Course not found"
      })
    }

    return res.status(200).json({
      courses
    }) 


  } catch (error) {
    console.error("getCreatorCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course.",
    });
  }
};
