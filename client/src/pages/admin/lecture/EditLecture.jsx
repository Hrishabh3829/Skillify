import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";
import BackButton from "@/components/BackButton";

const EditLecture = () => {
  const { courseId } = useParams();

  return (
    <div>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <BackButton label="Back" />
          </Link>
          <h1 className="font-bold text-2xl">Edit Lecture</h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
};

export default EditLecture;
