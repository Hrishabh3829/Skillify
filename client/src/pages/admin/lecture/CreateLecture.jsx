import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Lecture created successfully!");
      setLectureTitle("");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create lecture.");
    }
  }, [isSuccess, error, data]);

  return (
    <div className="flex-1 mx-4 sm:mx-6 md:mx-10">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="font-bold text-2xl text-gray-800 dark:text-white">
          Add a New Lecture
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Provide the details below to create a lecture for your course.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <Label className="my-2 font-medium text-gray-700 dark:text-gray-200">
            Lecture Title
          </Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter a clear and descriptive lecture title"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Example: <i>“Introduction to React Basics”</i>
          </p>
        </div>

        {/* Buttons */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="px-6"
          >
            Back to course
          </Button>

          <Button
            variant="default"
            disabled={isLoading}
            className="px-6"
            onClick={createLectureHandler}
          >
            {isLoading ? (
              <>
                <DotLottieReact
                  src="https://lottie.host/99307f19-5bee-48c9-90f1-11858c3a98d1/vtpTJ34roC.lottie"
                  loop
                  autoplay
                  style={{ height: "20px", width: "20px" }}
                />
                <span className="ml-2">Creating Lecture...</span>
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>

        {/* Lecture List */}
  <div className="mt-10">
          {lectureLoading ? (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Loader2 className="animate-spin" />
              <span>Loading lectures...</span>
            </div>
          ) : lectureError ? (
            <p className="text-red-500">Failed to load lectures.</p>
          ) : !lectureData?.lectures?.length ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No lectures yet — start by creating one!
            </p>
          ) : (
            <div className="space-y-3">
              {lectureData.lectures.map((lecture, index) => (
                <Lecture
                  key={lecture._id}
                  lecture={lecture}
                  courseId={courseId}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
