import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge, CheckCircle2, CirclePlay } from "lucide-react";
import React from "react";

const CourseProgress = () => {
  const isCompleted = true;
  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      {/* course name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Course Title</h1>
        <Button>Completed</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {/* video */}
        <div className="flex-1 md:h-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            {/* <video /> */}
            {/* Display current watching lecture title  */}
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-lg">Lecture-1: Introduction</h3>
          </div>
        </div>
        {/* Lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4].map((lecture, idx) => (
              <Card
                key={idx}
                className={"mb-3 hover:cursor-pointer transition transform "}
              >
                <CardContent
                  className={"flex items-center justify-between p-4"}
                >
                  <div className="flex items-center ">
                    {isCompleted ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className={"text-lg font-medium"}>
                        Introduction
                      </CardTitle>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-200 px-3 py-1 text-sm font-medium text-green-700">
                    Completed
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
