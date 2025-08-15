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

  // Calculate total price
  const totalPrice =
    data?.courses?.reduce((sum, course) => {
      return sum + (course.price || 0);
    }, 0) || 0;

  return (
    <div>
      <Button onClick={() => navigate(`create`)}>Create a new course</Button>

      <Table>
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
                    {course.price ? `₹${course.price}` : "NA"}
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
  );
};

export default Coursetable;
