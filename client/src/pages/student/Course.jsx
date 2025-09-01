import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

export const Course = ({ course, compact = false }) => {
  return (
    <Link to={`/course-detail/${course._id}`} className="block h-full">
      <Card className={`h-full flex flex-col overflow-hidden rounded-lg dark:bg-gray-900 bg-white shadow-lg ${compact ? "hover:shadow-xl" : "hover:shadow-2xl"} transform ${compact ? "hover:scale-[1.01]" : "hover:scale-[1.02]"} transition-transform duration-300 p-0`}>
        {/* Image (uniform aspect) */}
        <div className={`relative w-full ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt="course"
            src={course.courseThumbnail}
          />
        </div>

        <CardContent className={`${compact ? "px-3 py-3" : "px-4 sm:px-5 py-4"} flex-1 flex flex-col justify-between gap-3`}>
          {/* Course Title */}
          <h1 className={`hover:underline font-bold ${compact ? "text-sm sm:text-base" : "text-base sm:text-lg"} line-clamp-2 ${compact ? "min-h-[2.6rem]" : "min-h-[3.25rem]"}`}>
            {course.courseTitle}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className={`${compact ? "h-7 w-7" : "h-8 w-8"}`}>
                <AvatarImage src={course.creator?.photoUrl} />
                <AvatarFallback>^_^</AvatarFallback>
              </Avatar>
              <span className={`font-medium ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>
                {course.creator?.name}
              </span>
            </div>
            <Badge className="bg-blue-600 text-white px-2 py-1 text-[10px] sm:text-xs rounded-full">
              {course.courseLevel}
            </Badge>
          </div>

          <div className={`${compact ? "text-base sm:text-lg" : "text-lg sm:text-xl"} font-bold text-green-600 dark:text-green-400`}>
            ₹{course.coursePrice}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
