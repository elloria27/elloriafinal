import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Index from "./pages/Index";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Sustainability from "./pages/Sustainability";
import SustainabilityProgram from "./pages/SustainabilityProgram";
import ForBusiness from "./pages/ForBusiness";
import BulkOrders from "./pages/BulkOrders";
import CustomSolutions from "./pages/CustomSolutions";
import Donation from "./pages/Donation";
import Flow from "./pages/Flow";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import PersonalReminders from "./pages/admin/PersonalReminders";
import SiteSettings from "./pages/admin/SiteSettings";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Thanks from "./pages/Thanks";
import OrderSuccess from "./pages/OrderSuccess";
import Checkout from "./pages/Checkout";
import SharedFile from "./pages/SharedFile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:productId",
        element: <ProductDetail />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:postId",
        element: <BlogPost />,
      },
      {
        path: "sustainability",
        element: <Sustainability />,
      },
      {
        path: "sustainability-program",
        element: <SustainabilityProgram />,
      },
      {
        path: "for-business",
        element: <ForBusiness />,
      },
      {
        path: "bulk-orders",
        element: <BulkOrders />,
      },
      {
        path: "custom-solutions",
        element: <CustomSolutions />,
      },
      {
        path: "donation",
        element: <Donation />,
      },
      {
        path: "flow",
        element: <Flow />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "admin",
        element: <Admin />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "reminders",
            element: <PersonalReminders />,
          },
          {
            path: "settings",
            element: <SiteSettings />,
          },
        ],
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "thanks",
        element: <Thanks />,
      },
      {
        path: "order-success",
        element: <OrderSuccess />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "shared/:fileId",
        element: <SharedFile />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}