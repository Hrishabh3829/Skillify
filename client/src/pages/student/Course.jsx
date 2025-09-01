import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

export const Course = ({ course }) => {
  return (
  <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-0">
        {/* Image */}
        <div className="relative">
          <img
            className="w-full h-40 sm:h-44 md:h-48 object-cover"
            alt="course"
            src={course.courseThumbnail}
          />
        </div>

        <CardContent className="px-5 py-4 space-y-3">
          {/* Course Title */}
          <h1 className="hover:underline font-bold text-base sm:text-lg line-clamp-2">
            {course.courseTitle}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={course.creator?.photoUrl} />
                <AvatarFallback>^_^</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm sm:text-base">
                {course.creator?.name}
              </span>
            </div>
            <Badge className="bg-blue-600 text-white px-2 py-1 text-xs rounded-full">
              {course.courseLevel}
            </Badge>
          </div>

          <div className="text-lg sm:text-xl font-bold text-green-600">
            ₹{course.coursePrice}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
