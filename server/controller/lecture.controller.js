import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";

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
      lectures: course.lectures,
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

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    // Update lecture fields
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;
    // fixed condition: was "if (isPreviewFree)" which skipped `false`

    await lecture.save();

    // Ensure the course still references this lecture if not already added
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      // fixed: added missing "!" → previously it always pushed duplicate
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    console.error("Edit Lecture error:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the lecture. Please try again later.",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }

    // Delete the lecture video from Cloudinary (if exists)
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Remove the lecture reference from the associated course
    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } } // removed from array
    );

    return res.status(200).json({
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    console.error("Remove Lecture error:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while removing the lecture. Please try again later.",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found!",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.error("get Lecture error:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching the lecture. Please try again later.",
    });
  }
};
