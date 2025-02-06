import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Home = lazy(() => import("./pages/Index"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const Settings = lazy(() => import("./pages/profile/Settings"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/profile/settings",
    element: <Settings />,
  },
  {
    path: "bulk-orders",
    element: <BulkOrders content={{ title: "Bulk Orders", description: "Place your bulk order" }} />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

export default routes;
