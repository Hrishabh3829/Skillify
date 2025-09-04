import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();

  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [
    completeCourse,
    { isLoading: completeLoading },
  ] = useCompleteCourseMutation();

  const [
    inCompleteCourse,
    { isLoading: incompleteLoading },
  ] = useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);
  const videoRef = useRef(null);
  const [shouldAutoplayNext, setShouldAutoplayNext] = useState(false);

  // Autoplay next lecture after switching
  useEffect(() => {
    if (shouldAutoplayNext && videoRef.current) {
      try {
        const maybe = videoRef.current.play?.();
        if (maybe && typeof maybe.then === "function") {
          maybe.catch(() => {});
        }
      } catch {}
      setShouldAutoplayNext(false);
    }
  }, [shouldAutoplayNext, currentLecture]);

  // Safe data access regardless of loading/error so hooks order remains stable
  const courseData = data?.data ?? {};
  const courseDetails = courseData?.courseDetails ?? {};
  const progress = courseData?.progress ?? [];
  const completed = courseData?.completed ?? false;
  const courseTitle = courseDetails?.courseTitle ?? "Course";

  //initialize the first lecture
  const initialLecture =
    currentLecture || (courseDetails.lectures && courseDetails.lectures[0]);

  const lectureIdSet = useMemo(() => {
    const ids = new Set();
    (courseDetails?.lectures || []).forEach((l) => l?._id && ids.add(l._id));
    return ids;
  }, [courseDetails?.lectures]);

  const completedSet = useMemo(() => {
    const set = new Set();
    (progress || []).forEach((p) => {
      if (p?.viewed && p?.lectureId && lectureIdSet.has(p.lectureId)) {
        set.add(p.lectureId);
      }
    });
    return set;
  }, [progress, lectureIdSet]);

  const isLectureCompleted = (lectureId) => completedSet.has(lectureId);

  const totalLectures = courseDetails?.lectures?.length || 0;
  const completedCount = completedSet.size;
  const percent = totalLectures > 0 ? Math.min(100, Math.max(0, Math.round((completedCount / totalLectures) * 100))) : 0;

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId).unwrap();
      toast.success("Course marked as completed");
      refetch();
    } catch (e) {
      toast.error("Failed to mark as completed");
    }
  };
  const handleInCompleteCourse = async () => {
    try {
      await inCompleteCourse(courseId).unwrap();
      toast.success("Course marked as incomplete");
      refetch();
    } catch (e) {
      toast.error("Failed to update course status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4 md:mt-6">
      {isError ? (
        <div className="min-h-40 grid place-items-center text-center">
          <p className="text-sm text-red-600 dark:text-red-400">Failed to load course details.</p>
        </div>
      ) : isLoading ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-9 w-40" />
          </div>
          <Skeleton className="h-2 w-full mb-6" />
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-64 md:h-96 w-full md:flex-1 rounded-xl" />
            <div className="w-full md:w-[40%] md:max-w-[420px]">
              <Skeleton className="h-6 w-28 mb-3" />
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {courseTitle}
          </h1>
          <AnimatePresence initial={false}>
            {completed ? (
              <motion.div
                key="completed"
                initial={{ scale: 0.9, opacity: 0, y: -6 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -6 }}
                transition={{ type: "spring", duration: 0.3 }}
              >
                <Badge className="bg-green-600/15 text-green-700 dark:text-green-400 border border-green-600/20">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed
                </Badge>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
          className="transition-transform will-change-transform hover:scale-[1.02]"
          disabled={completeLoading || incompleteLoading}
        >
          {completeLoading || incompleteLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Mark as incomplete</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
          <span>
            {completedCount} of {totalLectures} lectures completed
          </span>
          <span>{percent}%</span>
        </div>
        <Progress value={percent} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Panel */}
        <motion.div
          layout
          className="flex-1 rounded-xl shadow-sm p-3 md:p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border border-border"
        >
          {initialLecture ? (
            <>
              <div className="relative">
                <video
                  ref={videoRef}
                  src={currentLecture?.videoUrl || initialLecture.videoUrl}
                  controls
                  className="w-full h-auto rounded-lg"
                  onEnded={async () => {
                    const currentId = currentLecture?._id || initialLecture._id;
                    await handleLectureProgress(currentId);
                    const idx = courseDetails?.lectures?.findIndex((l) => l._id === currentId) ?? -1;
                    const next = idx >= 0 ? courseDetails?.lectures?.[idx + 1] : null;
                    if (next) {
                      setCurrentLecture(next);
                      setShouldAutoplayNext(true);
                    }
                  }}
                />
              </div>
              <div className="mt-3 md:mt-4 flex items-center justify-between">
                <h3 className="font-medium text-base md:text-lg">
                  {`Lecture ${
                    courseDetails.lectures.findIndex(
                      (lec) =>
                        lec._id ===
                        (currentLecture?._id || initialLecture._id)
                    ) + 1
                  } : ${
                    currentLecture?.lectureTitle || initialLecture.lectureTitle
                  }`}
                </h3>
                <Badge variant="secondary" className="hidden md:inline-flex">
                  {isLectureCompleted(
                    currentLecture?._id || initialLecture._id
                  )
                    ? "Viewed"
                    : "Not viewed"}
                </Badge>
              </div>
            </>
          ) : (
            <div className="h-48 md:h-64 grid place-items-center text-muted-foreground">
              No lectures available yet.
            </div>
          )}
        </motion.div>

        {/* Lecture Sidebar */}
        <div className="w-full md:w-[40%] md:max-w-[420px] md:sticky md:top-20">
          <h2 className="font-semibold text-xl mb-3">Lectures</h2>
          <div className="max-h-[55vh] md:max-h-[70vh] overflow-y-auto pr-1 md:pr-2">
            <AnimatePresence initial={false}>
              {courseDetails?.lectures.map((lecture, idx) => {
                const active = lecture._id === (currentLecture?._id || initialLecture?._id);
                const done = isLectureCompleted(lecture._id);
                return (
                  <motion.div
                    key={lecture._id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.2) }}
                  >
                    <Card
                      className={`mb-3 cursor-pointer border ${
                        active
                          ? "bg-muted/60 dark:bg-muted/40 border-primary/30"
                          : "bg-background"
                      } hover:shadow-sm`}
                      onClick={() => handleSelectLecture(lecture)}
                    >
                      <CardContent className="flex items-center justify-between p-3 md:p-4">
                        <div className="flex items-center">
                          {done ? (
                            <CheckCircle2 size={22} className="text-green-500 mr-2" />
                          ) : (
                            <CirclePlay size={22} className="text-foreground/60 mr-2" />
                          )}
                          <div>
                            <CardTitle className="text-sm md:text-base font-medium">
                              {lecture.lectureTitle}
                            </CardTitle>
                            {active && (
                              <span className="text-xs text-primary">Currently playing</span>
                            )}
                          </div>
                        </div>
                        {done && (
                          <Badge className="bg-green-600/15 text-green-700 dark:text-green-400 border border-green-600/20">
                            Done
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default CourseProgress;
