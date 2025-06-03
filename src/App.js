import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminPage from "./pages/AdminPage/AdminPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUser from "./pages/ManageUser/ManageUser";
import MetroRoutes from "./pages/MetroRoute/MetroRoutes";
import BusRoutes from "./pages/BusRoute/BusRoutes";
import TicketPrice from "./pages/TicketPrice/TicketPrice";
import LoginPage from "./pages/Login/LoginPage";
const route = createBrowserRouter([
  {
    path: "/",
    element: <AdminPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "manage-users",
        element: <ManageUser />,
      },
      {
        path: "metro-routes",
        element: <MetroRoutes />,
      },
      {
        path: "bus-routes",
        element: <BusRoutes />,
      },
      {
        path: "ticket-price",
        element: <TicketPrice />,
      },
    ],
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const App = () => {
  return <RouterProvider router={route} />;
};

export default App;
