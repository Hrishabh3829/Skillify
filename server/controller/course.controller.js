import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
// Delete a course (and optionally its thumbnail) - only creator can delete
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    if (String(course.creator) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this course" });
    }
    // Remove thumbnail from Cloudinary if present
    if (course.courseThumbnail) {
      try {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      } catch (e) {
        // Non-fatal; log and continue
        console.warn("Thumbnail delete failed", e?.message);
      }
    }
    await Course.findByIdAndDelete(courseId);
    return res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete course" });
  }
};
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
    let { query = "", categories = [], sortByPrice = "" } = req.query;
    // Support comma-separated categories from client
    if (typeof categories === "string" && categories.length > 0) {
      categories = categories.split(",").map((c) => c.trim()).filter(Boolean);
    }

    const trimmedQuery = String(query || "").trim();
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const andConditions = [{ isPublished: true }];

    if (trimmedQuery) {
      andConditions.push({
        $or: [
          { courseTitle: { $regex: trimmedQuery, $options: "i" } },
          { subTitle: { $regex: trimmedQuery, $options: "i" } },
          { category: { $regex: trimmedQuery, $options: "i" } },
        ],
      });
    }

    if (Array.isArray(categories) && categories.length > 0) {
      // Partial, case-insensitive match for user-friendly filtering
      const categoryMatchers = categories
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => new RegExp(escapeRegex(c), "i"));

      andConditions.push({
        $or: [
          { category: { $in: categoryMatchers } },
          { courseTitle: { $in: categoryMatchers } },
          { subTitle: { $in: categoryMatchers } },
        ],
      });
    }

    const searchCriteria = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

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
