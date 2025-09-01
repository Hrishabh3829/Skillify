import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DarkMode } from "@/DarkMode";
import { EditIcon, LogOut, Menu, School } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi.js";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const NavBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
    navigate("/login");
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged Out");
    }
  }, [isSuccess]);

  // Fix: delay render until after hydration to prevent theme flash
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              E-Learning
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.photoUrl || "https://github.com/evilrabbit.png"
                      }
                    />
                    <AvatarFallback>^_^</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={"/my-learning"}>My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={"/profile"}>Edit Profile</Link>
                    <EditIcon className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Logout <LogOut className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                  {user?.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to={"/admin/dashboard"}>Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DarkMode />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Signup
              </Button>
              <DarkMode />
            </div>
          )}
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-Learning</h1>

        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default NavBar;

const MobileNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const onLogout = async () => {
    try {
      await logoutUser();
    } finally {
      navigate("/login");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full  hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <div className=" flex mt-2 gap-8">
            <SheetTitle className="font-stretch-50% text-2xl">
              <SheetClose asChild>
                <Link to={"/"}>
                  <Button>E-Learning</Button>
                </Link>
              </SheetClose>
            </SheetTitle>

            <DarkMode />
          </div>
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 mx-4">
          {user ? (
            <>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate("/my-learning")}
                  className="w-full text-left"
                >
                  My Learning
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="w-full text-left"
                >
                  Edit Profile
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="w-full text-left"
                >
                  Logout
                </Button>
              </SheetClose>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full text-left"
                >
                  Login
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full text-left"
                >
                  Signup
                </Button>
              </SheetClose>
            </>
          )}
        </nav>

        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="w-full"
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
