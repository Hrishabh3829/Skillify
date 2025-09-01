import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Coursetable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading....</h1>;

  const totalPrice =
    data?.courses?.reduce((sum, course) => {
      return sum + (Number(course.coursePrice) || 0);
    }, 0) || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate(`create`)}>Create a new course</Button>
      </div>

      {/* Mobile list (cards) */}
      <div className="md:hidden grid gap-3">
        {data?.courses?.length ? (
          data.courses.map((course) => (
            <div
              key={course._id}
              className="rounded-md border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-base line-clamp-2">
                    {course.courseTitle}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {course.coursePrice ? `₹${course.coursePrice}` : "NA"}
                    </span>
                    <Badge
                      className={
                        course.isPublished
                          ? "bg-green-500 text-white dark:bg-green-600"
                          : "bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`${course._id}`)}
                  className="shrink-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No courses found
          </p>
        )}
      </div>

      {/* Desktop/Tablet table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-800">
      <Table className="min-w-[720px]">
        <TableCaption>A list of your recent courses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses?.length > 0 ? (
            <>
              {data.courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell className="font-medium">
                    {course.coursePrice ? `₹${course.coursePrice}` : "NA"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        course.isPublished
                          ? "bg-green-500 text-white dark:bg-green-600"
                          : "bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                    >
                      <Edit />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow className="bg-gray-100 dark:bg-gray-800 font-bold">
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  ₹{totalPrice.toLocaleString()}
                </TableCell>
              </TableRow>
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No courses found
                
              </TableCell>
            </TableRow>
          )}
        </TableBody>
  </Table>
  </div>
    </div>
  );
};

export default Coursetable;
