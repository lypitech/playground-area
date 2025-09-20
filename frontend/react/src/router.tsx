import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Workflows from "./pages/Workflows";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "workflows", element: <Workflows /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
