import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SideBar = () => {
  return (
    <div className="flex">
      {/* Desktop Sidebar */}
  <div className="hidden lg:block w-[250px] xl:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-5 sticky top-16 h-[calc(100vh-4rem)]">
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
      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
        {/* Simple mobile links (no drawer) */}
        <div className="lg:hidden mb-4 flex gap-2">
          <Link to={"dashboard"}>
            <Button size="sm" variant="outline">Dashboard</Button>
          </Link>
          <Link to={"course"}>
            <Button size="sm" variant="outline">Courses</Button>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default SideBar;
