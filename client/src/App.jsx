import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./pages/NavBar";
import { HeroSection } from "./pages/student/HeroSection";
import { MainLayout } from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import { Courses } from "./pages/student/Courses";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses/>
          </>
        ),
      },
      {
        path:"login",
        element:<Login/>
      }
    ],
  },
]);
function App() {
  return (
    <main>
      <RouterProvider router={appRouter}/>
    </main>
  );
}

export default App;
