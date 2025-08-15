import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/pages/RichTextEditor";
import React from "react";

const CourseTab = () => {
  const isPublished = false;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Course Overview</CardTitle>
          <CardDescription>
            Edit your course details below. Click <strong>Save</strong> when all changes are complete.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            {isPublished ? "Unpublish Course" : "Publish Course"}
          </Button>
          <Button variant="destructive">Delete Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label className={"my-1"}>Course Title</Label>
            <Input 
              type="text" 
              name="title"
              placeholder="e.g., Full-Stack Web Development" 
            />
          </div>
          <div>
            <Label className={"my-1"}>Course Subtitle</Label>
            <Input 
              type="text" 
              name="subtitle"
              placeholder="e.g., Become a Full-Stack Developer from Scratch" 
            />
          </div>
          <div>
            <Label className={"my-1"}>Course Description</Label>
            <RichTextEditor />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
