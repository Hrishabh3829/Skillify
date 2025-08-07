"use client";

import { useTheme } from "next-themes";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";
import { createAnimation } from "./theme-animations";
import { useEffect, useRef, useState } from "react";

const ThemeToggleButton = ({ showLabel = false, variant = "circle-blur", start = "top-right", url }) => {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const currentStyleElement = useRef(null);

  const handleThemeToggle = () => {
    // Prevent multiple clicks during animation
    if (isAnimating) return;
    
    if (variant === "gif" || variant === "circle" || variant === "circle-blur" || variant === "polygon") {
      setIsAnimating(true);
      
      // Remove any existing animation styles
      if (currentStyleElement.current) {
        try {
          document.head.removeChild(currentStyleElement.current);
        } catch (e) {
          // Element might already be removed
        }
        currentStyleElement.current = null;
      }
      
      // Apply animation
      const animation = createAnimation(variant, start, url);
      
      // Create and inject CSS for the animation
      const styleElement = document.createElement('style');
      styleElement.textContent = animation.css;
      styleElement.setAttribute('data-theme-animation', 'true');
      document.head.appendChild(styleElement);
      currentStyleElement.current = styleElement;
      
      // Start view transition immediately for smoother experience
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }).finished.then(() => {
          // Clean up after transition completes
          setTimeout(() => {
            if (currentStyleElement.current) {
              try {
                document.head.removeChild(currentStyleElement.current);
              } catch (e) {
                // Element might already be removed
              }
              currentStyleElement.current = null;
            }
            setIsAnimating(false);
          }, 50); // Reduced delay for smoother experience
        }).catch(() => {
          // Fallback cleanup
          setTimeout(() => {
            if (currentStyleElement.current) {
              try {
                document.head.removeChild(currentStyleElement.current);
              } catch (e) {
                // Element might already be removed
              }
              currentStyleElement.current = null;
            }
            setIsAnimating(false);
          }, 800); // Reduced timeout
        });
      } else {
        // Fallback for browsers without view transitions
        setTheme(theme === "dark" ? "light" : "dark");
        setTimeout(() => {
          if (currentStyleElement.current) {
            try {
              document.head.removeChild(currentStyleElement.current);
            } catch (e) {
              // Element might already be removed
            }
            currentStyleElement.current = null;
          }
          setIsAnimating(false);
        }, 600); // Reduced timeout for smoother experience
      }
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentStyleElement.current) {
        try {
          document.head.removeChild(currentStyleElement.current);
        } catch (e) {
          // Element might already be removed
        }
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={variant === "circle" || variant === "circle-blur" || variant === "polygon" || variant === "gif" ? "outline" : variant} 
        size="icon" 
        onClick={handleThemeToggle}
        disabled={isAnimating}
        className="transition-all duration-150 hover:scale-105 rounded-md"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      {showLabel && (
        <span className="text-sm font-medium">
          {theme === "dark" ? "Light" : "Dark"} Mode
        </span>
      )}
    </div>
  );
};

export default ThemeToggleButton;
