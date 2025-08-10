import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";
import { Course } from "./Course";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy placeholder skeleton for a course card
const CourseSkeleton = () => (
  <Skeleton className="h-40 w-full rounded-lg" />
);

export const Profile = () => {
  const isLoading = false; // set true when fetching profile data
  const enrolledCourses = [1,2]; // replace with fetched data

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src="https://github.com/evilrabbit.png" />
            <AvatarFallback>^_^</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                Hrishabh Gupta
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                hrishabh@gmail.com
              </span>
            </h1>
          </div>

          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                Instructor
              </span>
            </h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size={"sm"} className={"mt-2"}>
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you are done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input type="text" placeholder="Name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input type="file" accept="image/*" className="col-span-3" />
                </div>
              </div>

              <DialogFooter>
                <Button disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <DotLottieReact
                        src="https://lottie.host/99307f19-5bee-48c9-90f1-11858c3a98d1/vtpTJ34roC.lottie"
                        loop
                        autoplay
                      />
                      Please wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-medium text-lg">Courses You Are Enrolled In</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {enrolledCourses.length === 0 ? (
            <h1 className="col-span-full text-gray-500">
              You haven&apos;t enrolled in any courses yet.
            </h1>
          ) : (
            enrolledCourses.map((course, index) => <Course key={index} />)
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <Skeleton className="h-7 w-40 mx-auto md:mx-0" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full mb-4" />
        </div>

        <div className="space-y-3 w-full">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>

      <Skeleton className="h-6 w-56" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
