import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Admin Pages
import AdminPage from "./pages/AdminPage/AdminPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUser from "./pages/ManageUser/ManageUser";
import MetroRoutes from "./pages/MetroRoute/MetroRoutes";
import BusRoutes from "./pages/BusRoute/BusRoutes";
import TicketPrice from "./pages/TicketPrice/TicketPrice";
import LoginPage from "./pages/Login/LoginPage";

// Staff Pages (đúng theo thư mục StaffPage bạn đặt)
import StaffPage from "./pages/StaffPage/StaffPage";
import NewsPage from "./pages/StaffPage/NewsPage";
import FareAdjustmentPage from "./pages/StaffPage/FareAdjustmentPage";


const route = createBrowserRouter([
  // 👨‍💼 Admin
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

  // 🔐 Login
  {
    path: "/login",
    element: <LoginPage />,
  },

  // 🧑‍🏭 Staff
  {
    path: "/staff",
    element: <StaffPage />,
    children: [
      {
        index: true,
        element: <NewsPage />,
      },
       {
      path: "news", // 
      element: <NewsPage />,
    },
      {
        path: "fare-adjustment",
        element: <FareAdjustmentPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={route} />;
};

export default App;
