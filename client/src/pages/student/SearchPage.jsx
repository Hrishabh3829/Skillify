import React from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const { data, isLoading } = useGetSearchCourseQuery();

  const isEmpty = false;
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-5">
      <div className="my-6">
        <h1 className="font-bold text-xl md:text-2xl">result for "{query}"</h1>
        <p>
          Showing results for {""}
          <span className="text-blue-800 font-bold italic">
           {query}
          </span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <Filter />
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            [1, 2, 3].map((_, idx) => <SearchResult key={idx} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between p-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className={"h-full w-full object-cover"} />
      </div>
      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className={"h-6 w-3/4"} />
        <Skeleton className={"h-4 w-1/2"} />
        <div className="flex items-center gap-2">
          <Skeleton className={"h-4 w-1/3"} />
        </div>
        <Skeleton className={"h-6 w-20 mt-2"} />
      </div>
      <div className="flex flex-col items-end justify-between mt-4 ">
        <Skeleton className={"h-6 w-12"} />
      </div>
    </div>
  );
};

const CourseNotFound = () => {
  return <p>course not fond</p>;
};
