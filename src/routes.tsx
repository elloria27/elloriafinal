import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index } from "@/pages/Index";
import { NotFound } from "@/pages/NotFound";
import { Product } from "@/pages/Product";
import { Category } from "@/pages/Category";
import { AppLayout } from "@/layouts/AppLayout";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { Confirmation } from "@/pages/Confirmation";
import { Blog } from "@/pages/Blog";
import { Post } from "@/pages/Post";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Profile } from "@/pages/Profile";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import Setup from "@/pages/Setup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/products/:productId",
        element: <Product />,
      },
      {
        path: "/categories/:categoryId",
        element: <Category />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/confirmation",
        element: <Confirmation />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog/:postId",
        element: <Post />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/setup",
        element: <Setup />,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
