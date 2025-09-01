import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { Course } from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

export const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCourseQuery();
  if (isError) return <h1>Some error occured while fetching courses.</h1>;

  return (
  <div className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
    <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses &&
              data.courses.map((course, index) => <Course key={index} course={course} />)}
        </div>
      </div>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="w-full h-36" />

      <div className="px-5 py-4 space-y-3">
        {/* Title placeholder */}
        <Skeleton className="h-6 w-3/4" />

        {/* Instructor section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Extra info placeholder */}
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
