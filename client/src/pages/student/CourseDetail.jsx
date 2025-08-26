import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import BuyCourseButton from "../BuyCourseButton";
import { useParams } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
// Using native <video> for robust Cloudinary playback

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  // All hooks must run unconditionally in the same order every render
  const { data, isLoading, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Failed to load course details</h1>;

  const { course, purchased } = data;
  // Choose a preview lecture: first free preview with video, else first with any video
  const previewLecture =
    course?.lectures?.find((l) => l?.isPreviewFree && l?.videoUrl) ||
    course?.lectures?.find((l) => l?.videoUrl) ||
    course?.lectures?.[0];
  // Normalize Cloudinary URL to https to avoid mixed content blocks
  const rawUrl = previewLecture?.videoUrl;
  const playerUrl = rawUrl?.startsWith("http://res.cloudinary.com")
    ? rawUrl.replace("http://", "https://")
    : rawUrl;

  // Build Cloudinary transformed URLs for wider browser support
  const isCloudinary =
    playerUrl?.includes("res.cloudinary.com") && playerUrl.includes("/upload/");
  const withTransform = (url, transform) =>
    isCloudinary ? url.replace("/upload/", `/upload/${transform}/`) : url;
  const mp4Url = withTransform(playerUrl || "", "f_mp4,vc_h264,q_auto");
  const webmUrl = withTransform(playerUrl || "", "f_webm,vc_vp9,q_auto");
  const autoUrl = withTransform(playerUrl || "", "f_auto,vc_auto,q_auto");

  return (
    <div className="mt-20">
      {/* Header Section */}
      <header className="bg-[#212224] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course?.subTitle}</p>

          <div className="flex flex-col gap-1 text-sm mt-2">
            <p>
              By{" "}
              <span className="text-[#C0C4FC] underline italic">
                {course?.creator.name}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <BadgeInfo size={16} />
              <span>Last updated: {course?.createdAt.split("T")[0]}</span>
            </div>
            <p>Enrolled Students: {course?.enrolledStudents.length}</p>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Side */}
        <section className="w-full lg:w-2/3 space-y-5">
          <h2 className="font-bold text-xl md:text-2xl">Description</h2>
          <p
            className="text-sm md:text-base text-gray-700 leading-relaxed dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: course?.description }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm border-b last:border-0 pb-2"
                >
                  <span>
                    {true ? <PlayCircle size={16} /> : <Lock size={16} />}
                  </span>
                  <span>{lecture.lectureTitle}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Right Side */}
        <aside className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4 bg-gray-200 flex items-center justify-center text-gray-600">
                {playerUrl ? (
                  <video
                    key={playerUrl}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    controls
                    playsInline
                    preload="metadata"
                    onError={(e) => {
                      // eslint-disable-next-line no-console
                      console.error("Native video error:", e);
                    }}
                  >
                    {isCloudinary ? (
                      <>
                        <source src={mp4Url} type="video/mp4" />
                        <source src={webmUrl} type="video/webm" />
                        <source src={autoUrl} />
                      </>
                    ) : (
                      <source src={playerUrl} />
                    )}
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <span>No preview available</span>
                )}
              </div>
              <h3 className="font-semibold text-lg md:text-xl">
                {previewLecture?.lectureTitle || "Lecture Title"}
              </h3>
              <Separator className="my-2" />
              <h4 className="text-lg md:text-xl font-semibold">
                {course?.coursePrice}
              </h4>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button className="w-full">Continue Course</Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default CourseDetail;
