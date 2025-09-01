import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();
  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };
  return (
    <div className="flex items-start justify-between gap-3 bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-3 rounded-md my-2">
      <h1 className="font-bold text-gray-800 dark:text-gray-100 break-words">
        Lecture {index + 1}: {lecture?.lectureTitle}
      </h1>
      <button
        aria-label="Edit lecture"
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        onClick={goToUpdateLecture}
      >
        <Edit
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          size={20}
        />
      </button>
    </div>
  );
};

export default Lecture;
