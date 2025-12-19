import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import App from "./App.jsx";
import { lazy, Suspense } from "react";

const Login = lazy(() => import("./routes/Login.jsx"));
const Register = lazy(() => import("./routes/Register.jsx"));
const Dashboard = lazy(() => import("./routes/Dashboard.jsx"));
const Error = lazy(() => import("./routes/Error.jsx"));

// Lazy Load Features
const ListProjects = lazy(() => import("./features/projects/pages/ListProjects.jsx"));
const CreateProject = lazy(() => import("./features/projects/pages/CreateProject.jsx"));
const EditProject = lazy(() => import("./features/projects/pages/EditProject.jsx"));

// Features: Blogs
const ListBlogs = lazy(() => import("./features/blogs/pages/ListBlogs.jsx"));
const CreateBlog = lazy(() => import("./features/blogs/pages/CreateBlog.jsx"));
const EditBlog = lazy(() => import("./features/blogs/pages/EditBlog.jsx"));

// Features: Skills
const ListSkills = lazy(() => import("./features/skills/pages/ListSkills.jsx"));
const CreateSkill = lazy(() => import("./features/skills/pages/CreateSkill.jsx"));
const EditSkill = lazy(() => import("./features/skills/pages/EditSkill.jsx"));

// Features: Services
const ListServices = lazy(() => import("./features/services/pages/ListServices.jsx"));
const CreateService = lazy(() => import("./features/services/pages/CreateService.jsx"));
const EditService = lazy(() => import("./features/services/pages/EditService.jsx"));

// About Module
const ViewAbout = lazy(() => import("./features/about/pages/ViewAbout.jsx"));
const CreateAbout = lazy(() => import("./features/about/pages/CreateAbout.jsx"));
const EditAbout = lazy(() => import("./features/about/pages/EditAbout.jsx"));

// Features: Testimonials
const ListTestimonials = lazy(() => import("./features/testimonials/pages/ListTestimonials.jsx"));
const CreateTestimonial = lazy(() => import("./features/testimonials/pages/CreateTestimonial.jsx"));
const EditTestimonial = lazy(() => import("./features/testimonials/pages/EditTestimonial.jsx"));

// Features: Experience
const ListExperience = lazy(() => import("./features/experience/pages/ListExperience.jsx"));
const CreateExperience = lazy(() => import("./features/experience/pages/CreateExperience.jsx"));
const EditExperience = lazy(() => import("./features/experience/pages/EditExperience.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Navigate to="/cms/dashboard" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "cms",
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              // Projects Module
              { path: "projects", element: <ListProjects /> },
              { path: "projects/new", element: <CreateProject /> },
              { path: "projects/:id/edit", element: <EditProject /> },
              // Blogs Module
              { path: "blogs", element: <ListBlogs /> },
              { path: "blogs/new", element: <CreateBlog /> },
              { path: "blogs/:id/edit", element: <EditBlog /> },
              // Skills Module
              { path: "skills", element: <ListSkills /> },
              { path: "skills/new", element: <CreateSkill /> },
              { path: "skills/:id/edit", element: <EditSkill /> },
              // Services Module
              { path: "services", element: <ListServices /> },
              { path: "services/new", element: <CreateService /> },
              { path: "services/:id/edit", element: <EditService /> },

              // About Module
              { path: "about", element: <ViewAbout /> },
              { path: "about/new", element: <CreateAbout /> },
              { path: "about/edit", element: <EditAbout /> },

              // Testimonials Module
              { path: "testimonials", element: <ListTestimonials /> },
              { path: "testimonials/new", element: <CreateTestimonial /> },
              { path: "testimonials/:id/edit", element: <EditTestimonial /> },

              // Experience Module
              { path: "experience", element: <ListExperience /> },
              { path: "experience/new", element: <CreateExperience /> },
              { path: "experience/:id/edit", element: <EditExperience /> },
            ]
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <Suspense fallback={null}>
    <RouterProvider router={router} />
  </Suspense>
);