import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
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

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    //create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    //if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    //define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1;
    }

    let courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
    
  } catch (error) {
    console.log("searchCourse error: ", error);
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses available.",
      });
    }

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("getPublishedCourse error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch published courses.",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "Course not found",
      });
    }

    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("getCreatorCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course.",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    let courseThumbnail;

    if (thumbnail) {
      // Delete old thumbnail if exists
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // Upload new thumbnail
      const uploadResponse = await uploadMedia(thumbnail.path);
      courseThumbnail = uploadResponse.secure_url;
    }

    // Update course
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    };

    if (courseThumbnail) {
      updateData.courseThumbnail = courseThumbnail;
    }

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ course, message: "Course updated successfully." });
  } catch (error) {
    console.error("editCourses error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update course." });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch course.",
    });
  }
};

//Publish and Unpublish Logic
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //true or false
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    // Toggle publish status
    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished
      ? "🚀 Your course is now live!"
      : "⏸️ Your course has been unpublished.";

    return res.status(200).json({
      message: statusMessage,
    });
  } catch (error) {
    console.error("togglePublishCourse error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating course status.",
    });
  }
};
