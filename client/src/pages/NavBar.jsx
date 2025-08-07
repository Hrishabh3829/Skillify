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
import { useTheme } from "@/components/ui/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";

const NavBar = () => {
  const user = false;

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
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/evilrabbit.png" />
                    <AvatarFallback>^_^</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem>My Learning</DropdownMenuItem>
                  <DropdownMenuItem>
                    Edit Profile <EditIcon className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Logout <LogOut className="ml-2 h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DarkMode />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">Login</Button>
              <Button variant="outline">Signup</Button>
              <DarkMode />
            </div>
          )}
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">E-Learning</h1>

        <MobileNavbar />
      </div>
    </div>
  );
};

export default NavBar;

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          
          <div className=" flex mt-2 gap-8">
          <SheetTitle className="font-stretch-50% text-2xl">E-Learning</SheetTitle>

          <DarkMode />
          </div>
        </SheetHeader>
        <Separator className="mr-2"/>
        <nav className="flex flex-col space-y-4 mx-4">
          <span>My Learning</span>
          <span>Edit Profile</span>
          <p>Logout</p>
        </nav>
        {/* {
          role="instructor" ? 
        } */}
      </SheetContent>
    </Sheet>
  );
};
