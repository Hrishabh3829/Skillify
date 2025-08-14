import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5 sticky top-0 h-screen">
        <div className="mt-20 space-y-4">
          <Link
            to={"dashboard"}
            className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link
            to={"course"}
            className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
      </div>
      <div className="flex-1 md:p-24 p-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default SideBar;
