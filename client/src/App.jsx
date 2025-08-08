import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./pages/NavBar";
import { HeroSection } from "./pages/student/HeroSection";
import { MainLayout } from "./layout/MainLayout";
import { RouterProvider } from "react-router";

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
