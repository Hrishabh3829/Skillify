import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import RichTextEditor from "@/pages/RichTextEditor";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "", // plain text for DB
    descriptionHtml: "", // HTML for editor
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "", // file object if user selects
  });

  const [previewThumbnail, setPreviewThumbnail] = useState(""); // preview URL

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();
  const [publishCourse] = usePublishCourseMutation();

  // Fetch course data and populate state
  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData.course;

      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description
          ? course.description.replace(/<[^>]+>/g, "").trim()
          : "",
        descriptionHtml: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice ?? "",
        courseThumbnail: "",
      });

      if (course.courseThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
    }
  }, [courseByIdData]);

  // Handlers
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    if (!input.subTitle.trim()) {
      toast.error("Course subtitle is required.");
      return false;
    }
    if (!input.category) {
      toast.error("Please select a course category.");
      return false;
    }
    if (!input.courseLevel) {
      toast.error("Please choose a course level.");
      return false;
    }
    if (!input.courseThumbnail && !previewThumbnail) {
      toast.error("A course thumbnail is required.");
      return false;
    }
    if (Number(input.coursePrice) < 100) {
      toast.error("Course price must be at least ₹100.");
      return false;
    }

    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);

    if (input.courseThumbnail) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }

    await editCourse({ formData, courseId });
    return true;
  };

  const handleSaveAndNavigate = async () => {
    const success = await updateCourseHandler();
    if (success) {
      navigate("/admin/course");
    }
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch {
      toast.error(data?.message || "Failed to publish/unpublish course");
    }
  };

  // Toasts for success/error
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully.");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course.");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Course Overview</CardTitle>
          <CardDescription>
            Provide the details for your course below. Click{" "}
            <strong>Save</strong> once all changes are finalized.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            disabled={courseByIdData?.course.lectures.length === 0}
            variant="outline"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.course.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.course.isPublished
              ? "Unpublish Course"
              : "Publish Course"}
          </Button>
          <Button variant="destructive">Delete Course</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label className="my-1">Course Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Enter the main title of your course"
            />
          </div>

          <div>
            <Label className="my-1">Course Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Provide a short, descriptive subtitle"
            />
          </div>

          <div>
            <Label className="my-1">Course Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="flex items-center gap-5">
            <div>
              <Label className="my-1">Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Category</SelectLabel>
                    <SelectItem value="Web Development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="Cloud Computing">
                      Cloud Computing
                    </SelectItem>
                    <SelectItem value="Data Science & AI">
                      Data Science & AI
                    </SelectItem>
                    <SelectItem value="DSA & Programming">
                      DSA & Programming
                    </SelectItem>
                    <SelectItem value="System Design">System Design</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Mobile Development">
                      Mobile Development
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="my-1">Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Difficulty Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="my-1">Price (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="Enter course price, e.g., 199"
                min={100}
                step={100}
                className="w-fit"
              />
            </div>
          </div>

          <div>
            <Label className="my-1">Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="CourseThumbnail"
              />
            )}
          </div>

          <div className="flex space-x-2 mt-4">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleSaveAndNavigate}
            >
              {isLoading ? (
                <>
                  <DotLottieReact
                    src="https://lottie.host/99307f19-5bee-48c9-90f1-11858c3a98d1/vtpTJ34roC.lottie"
                    loop
                    autoplay
                  />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
