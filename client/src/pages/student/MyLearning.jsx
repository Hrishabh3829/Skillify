import React, { useMemo, useState } from "react";
import { Course } from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

export const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user?.enrolledCourses || [];

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("recent");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = Array.isArray(myLearning) ? [...myLearning] : [];
    if (q) {
      list = list.filter((c) =>
        (c?.courseTitle || "").toLowerCase().includes(q)
      );
    }
    switch (sortKey) {
      case "price-asc":
        list.sort((a, b) => (a?.coursePrice || 0) - (b?.coursePrice || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b?.coursePrice || 0) - (a?.coursePrice || 0));
        break;
      case "title":
        list.sort((a, b) => (a?.courseTitle || "").localeCompare(b?.courseTitle || ""));
        break;
      default:
        // recent: keep original order
        break;
    }
    return list;
  }, [myLearning, query, sortKey]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-2xl md:text-3xl tracking-tight">My Learning</h1>
          {!isLoading && (
            <Badge variant="secondary" className="text-xs">{myLearning.length} courses</Badge>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="sm:w-72">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your courses"
              className="w-full"
            />
          </div>
          <Select onValueChange={setSortKey} value={sortKey}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-4" />

      {isLoading ? (
        <MyLearningSkeleton />
      ) : filtered.length === 0 ? (
        <div className="min-h-56 grid place-items-center text-center">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">No courses found</h2>
            <p className="text-muted-foreground mt-1">{query ? "Try adjusting your search or filters." : "You aren’t enrolled in any course yet."}</p>
            <Link to="/">
              <Button className="mt-4">Browse courses</Button>
            </Link>
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence initial={false}>
            {filtered.map((course) => (
              <motion.div
                key={course._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                <Course course={course} compact />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-lg overflow-hidden">
        <Skeleton className="w-full aspect-[16/9]" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
