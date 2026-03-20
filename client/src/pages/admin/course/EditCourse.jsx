import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";
import BackButton from "@/components/BackButton";

const EditCourse = () => {
  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <BackButton label="Back to courses" to="/admin/course" />
          <h1 className="font-bold text-xl">
            Provide Detailed Information About the Course
          </h1>
        </div>
        <Link to="lecture">
          <Button className={"hover:text-shadow-blue-600 w-full sm:w-auto"} variant="outline">
            Manage Course Lectures
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;
