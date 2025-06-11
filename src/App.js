import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminPage from "./pages/AdminPage/AdminPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUser from "./pages/ManageUser/ManageUser";
import MetroRoutes from "./pages/MetroRoute/MetroRoutes";
import BusRoutes from "./pages/BusRoute/BusRoutes";
import TicketPrice from "./pages/TicketPrice/TicketPrice";
import LoginPage from "./pages/Login/LoginPage";

import NewsPage from './pages/NewsPage/NewsPage';
import FareAdjustment from './pages/FareAdjustment/FareAdjustment';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyInfo } from './redux/userSlice';

const route = createBrowserRouter([
  {
    path: "/",
    element: <AdminPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "manage-users", element: <ManageUser /> },
      { path: "metro-routes", element: <MetroRoutes /> },
      { path: "bus-routes", element: <BusRoutes /> },
      { path: "ticket-price", element: <TicketPrice /> },

      // ✅ Thêm route cho Staff
      { path: "staff/news", element: <NewsPage /> },
      { path: "staff/fare-adjustment", element: <FareAdjustment /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state) => state.user.isAuthorized);

  useEffect(() => {
    if (isAuthorized) {
      dispatch(getMyInfo());
    }
  }, [isAuthorized, dispatch]);

  return <RouterProvider router={route} />;
};

export default App;
