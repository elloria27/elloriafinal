
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Setup from "@/pages/Setup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="p-8">Welcome to the app!</div>,
    errorElement: <NotFound />,
    children: [],
  },
  {
    path: "/setup",
    element: <Setup />,
  }
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
