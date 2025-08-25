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

const CourseDetail = () => {
  const purchasedCourse = false;

  return (
    <div className="mt-20">
      {/* Header Section */}
      <header className="bg-[#212224] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>
          <p className="text-base md:text-lg">Course Subtitle</p>

          <div className="flex flex-col gap-1 text-sm mt-2">
            <p>
              By{" "}
              <span className="text-[#C0C4FC] underline italic">Hrishabh</span>
            </p>
            <div className="flex items-center gap-2">
              <BadgeInfo size={16} />
              <span>Last updated: 11 Nov 2025</span>
            </div>
            <p>Enrolled Students: 10</p>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Side */}
        <section className="w-full lg:w-2/3 space-y-5">
          <h2 className="font-bold text-xl md:text-2xl">Description</h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed dark:text-gray-300">
            This course provides a step-by-step learning path, covering both
            fundamental concepts and practical applications. By the end, you’ll
            gain the skills and confidence to apply your knowledge in real-world
            projects.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-sm border-b last:border-0 pb-2"
                >
                  <span>
                    {true ? <PlayCircle size={16} /> : <Lock size={16} />}
                  </span>
                  <span>Lecture {idx + 1}</span>
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
                React Player Video Here
              </div>
              <h3 className="font-semibold text-lg md:text-xl">
                Lecture Title
              </h3>
              <Separator className="my-2" />
              <h4 className="text-lg md:text-xl font-semibold">Course Price</h4>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchasedCourse ? (
                <Button className="w-full">Continue Course</Button>
              ) : (
                <BuyCourseButton />
              )}
            </CardFooter>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default CourseDetail;
