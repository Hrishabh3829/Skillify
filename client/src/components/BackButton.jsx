import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

//reusable back button for pages
export function BackButton({
  label = "Back",
  className,
  onClick,
  to,
  ...props
}) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
    if (event?.defaultPrevented) return;

    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border-pink-200/70 bg-pink-50/80 text-pink-700 shadow-sm",
        "dark:border-pink-900/60 dark:bg-pink-950/40 dark:text-pink-100",
        "hover:bg-pink-100 hover:border-pink-300 dark:hover:bg-pink-900/70",
        "transition-all duration-200 px-3 py-1",
        className
      )}
      {...props}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-pink-500 shadow group-hover:-translate-x-0.5 group-hover:text-pink-600 dark:bg-pink-900/70 dark:text-pink-200">
        <ArrowLeft className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
    </Button>
  );
}

export default BackButton;
