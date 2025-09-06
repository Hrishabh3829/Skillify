import { createBrowserRouter, Link } from "react-router-dom";
import Login from "./pages/Login";
import { HeroSection } from "./pages/student/HeroSection";
import { MainLayout } from "./layout/MainLayout";
import { RouterProvider } from "react-router";
import { useLoadUserQuery } from "@/features/api/authApi";
import { Courses } from "./pages/student/Courses";
import { MyLearning } from "./pages/student/MyLearning";
import { Profile } from "./pages/student/Profile";
import SideBar from "./pages/admin/Sidebar";
import { Dashboard } from "./pages/admin/Dashboard";
import Coursetable from "./pages/admin/course/Coursetable";
import { AddCourse } from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./pages/ProtectedRoute";
import PurchaseCourseProtectedRoute from "./pages/PurchaseCourseProtectedRoute";
import OAuthSuccess from "./pages/OAuthSuccess";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: (
      <div className="p-10 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">An unexpected error occurred.</p>
        <Link to="/" className="text-primary underline">Go Home</Link>
      </div>
    ),
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "oauth-success",
        element: <OAuthSuccess />
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },
  //admin
      {
        path: "admin",
        element: (
          <AdminRoute>
            <SideBar />
          </AdminRoute>
        ),

        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: <Coursetable />
          },
          {
            path: "course/create",
            element: <AddCourse />
          },
          {
            path: "course/:courseId",
            element: <EditCourse />
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />
          },
        ],
      },
      {
        path: "*",
        element: (
          <div className="p-10 text-center space-y-3">
            <h2 className="text-3xl font-bold">404</h2>
            <p className="text-muted-foreground">Page not found.</p>
            <Link to="/" className="text-primary underline">Return home</Link>
          </div>
        ),
      },
    ],
  },
]);
function App() {
  useLoadUserQuery();
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
