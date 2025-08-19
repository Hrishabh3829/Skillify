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
import React, { useEffect, useState } from "react";
import { Course } from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

// Skeleton components
const CourseSkeleton = () => <Skeleton className="h-40 w-full rounded-lg" />;

const ProfileSkeleton = () => (
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

export const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
      data: updateUserData,
    },
  ] = useUpdateUserMutation();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setProfilePhoto("");
      toast.success(updateUserData?.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error?.data?.message || "Profile update failed.");
    }
  }, [isSuccess, isError, error, updateUserData, refetch]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    if (name.trim()) formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  if (isLoading) return <ProfileSkeleton />;

  const user = data?.user;
  const enrolledCourses = user?.enrolledCourses || [];

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
          <AvatarImage
            src={user?.photoUrl || "https://github.com/evilrabbit.png"}
          />
          <AvatarFallback>^_^</AvatarFallback>
        </Avatar>

        <div>
          <p className="mb-2">
            <strong>Name:</strong> {user?.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="mb-2">
            <strong>Role:</strong> {user?.role?.toUpperCase()}
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserIsLoading ? (
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
            enrolledCourses.map((course) => (
              <Course course={course} key={course._id || course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
