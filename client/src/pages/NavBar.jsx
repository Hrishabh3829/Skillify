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
import { EditIcon, LogOut, School } from "lucide-react";
import React from "react";

const NavBar = () => {
  const user = true;
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Dekstop */}
      <div className=" max-w-7xl mx-auto hiddden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>
        {/* user icon and dark mode icon */}
        <div className="flex items-center gap-2">
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
                  {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem>My Learning</DropdownMenuItem>
                  <DropdownMenuItem>
                    Edit Profile
                    <EditIcon />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Logout
                    <LogOut />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DarkMode/>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline">Login</Button>
              <Button variant="outline">Signup</Button>
              <DarkMode/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
