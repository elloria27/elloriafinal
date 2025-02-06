import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const Home = lazy(() => import("./pages/Index"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const Settings = lazy(() => import("./pages/profile/Settings"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));

const routes: RouteObject[] = [
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
    element: <BulkOrders content={{ 
      title: "Bulk Orders", 
      description: "Place your bulk order",
      features: [
        {
          icon: "Package",
          title: "Bulk Ordering",
          description: "Order products in large quantities"
        }
      ]
    }} />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

export default routes;