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
            ? Array.from({ length: data?.courses?.length || 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.courses &&
              data.courses.map((course, index) => (
                <Course key={course._id || index} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden h-full flex flex-col">
      {/* Image placeholder with same aspect as real cards */}
      <div className="relative w-full aspect-[16/9]">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      <div className="px-5 py-4 space-y-3 flex-1 flex flex-col justify-between">
        {/* Title placeholder */}
        <Skeleton className="h-6 w-3/4" />

        {/* Instructor section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Extra info placeholder */}
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
};
