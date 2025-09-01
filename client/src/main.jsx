import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useLoadUserQuery } from "./features/api/authApi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  // const { isLoading } = { isLoading: true }; 

  return (
    <>
      {isLoading ? 
        <DotLottieReact
          src="https://lottie.host/99307f19-5bee-48c9-90f1-11858c3a98d1/vtpTJ34roC.lottie"
          loop
          autoplay
        />
       : 
        <>{children}</>
      }
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Custom>
          <App />
          <Toaster position="top-right" duration={2200} richColors closeButton={false} />
        </Custom>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
