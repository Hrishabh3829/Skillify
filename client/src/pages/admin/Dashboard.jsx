import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Dashboard = () => {
  const { data, isSuccess, isLoading, isError } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1 className="text-center text-lg">Loading...</h1>;
  if (isError) {
    return (
      <h1 className="text-red-500 text-center">
        ❌ Failed to load purchased courses
      </h1>
    );
  }

  const { purchasedCourse = [] } = data || {};
  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));

  const totalSales = purchasedCourse.length;
  const totalRevenue = purchasedCourse.reduce(
    (acc, c) => acc + c.courseId.coursePrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top row - Sales & Revenue */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {/* Total Sales */}
        <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-200">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalSales}
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-200">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ₹{totalRevenue}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Full-width Chart */}
      <Card className="shadow-lg hover:shadow-xl transition duration-300 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Course Prices Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courseData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No purchased course data available.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={courseData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  className="dark:stroke-gray-400"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg, #1f2937)",
                    borderRadius: "0.5rem",
                    border: "1px solid #374151",
                    color: "#f9fafb",
                  }}
                  labelStyle={{ color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                  formatter={(value, name) => [`₹${value}`, name]}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4a90e2"
                  strokeWidth={3}
                  dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
