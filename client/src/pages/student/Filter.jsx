import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useMemo, useState } from "react";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const categories = [
  { id: "Next.js", label: "Next.js" },
  { id: "JavaScript", label: "JavaScript" },
  { id: "Python", label: "Python" },
  { id: "MongoDB", label: "MongoDB" },
  { id: "HTML", label: "HTML" },
];
const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const { data: publishedData } = useGetPublishedCourseQuery();

  // Build dynamic categories from first word of each published course title
  const dynamicCategories = useMemo(() => {
    const set = new Set();
    const courses = publishedData?.courses || publishedData?.data || [];
    for (const c of courses) {
      const title = c?.courseTitle || c?.title || "";
      if (!title) continue;
      const first = title.trim().split(/\s+/)[0];
      if (first) set.add(first);
    }
    // Map to objects with id/label
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((w) => ({ id: w, label: w }));
  }, [publishedData]);

  const mergedCategories = useMemo(() => {
    const base = [...categories];
    const existing = new Set(base.map((c) => c.id));
    for (const d of dynamicCategories) {
      if (!existing.has(d.id)) base.push(d);
    }
    return base;
  }, [dynamicCategories]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger className="w-[140px] text-gray-700 dark:text-gray-300">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price</SelectLabel>
              <SelectItem value="low">Low → High</SelectItem>
              <SelectItem value="high">High → Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className={"my-4"} />
      <div>
        <h1 className="font-semibold mb-2">Categories</h1>
        {mergedCategories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label
              htmlFor={category.id}
              className={
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              }
            >
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
