import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import LineManagement from "./pages/LineManagement/LineManagement";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import Login from "./pages/Login/Login";
import FareAdjustment from './pages/FareAdjustment/FareAdjustment';
import MainLayout from './components/MainLayout/MainLayout';
import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyInfo } from './redux/userSlice';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from "./pages/UserManagement/UserManagement";
import NewsManagement from "./pages/NewsManagement/NewsManagement";
import BusRouteManagement from "./pages/BusRouteManagement/BusRouteManagement";
import TicketManagement from "./pages/TicketManagement/TicketManagement";
import StationManagement from "./pages/StationManagement/StationManagement";
import EditProfile from "./pages/EditProfile/EditProfile";
import ChangePassword from "./pages/ChangePassword/ChangePassword";


const route = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "manage-users", element: <UserManagement /> },
      { path: "metro-line", element: <LineManagement /> },
      { path: "stations", element: <StationManagement /> },
      { path: "bus-routes", element: <BusRouteManagement /> },
      { path: "ticket-price", element: <TicketManagement /> },
      { path: "role-management", element: <RoleManagement /> },

      // ✅ Thêm route cho Staff
      { path: "staff/news", element: <NewsManagement /> },
      { path: "staff/fare-adjustment", element: <FareAdjustment /> },
      
      // ✅ Thêm route cho Edit Profile
      { path: "edit-profile", element: <EditProfile /> },
      
      // ✅ Thêm route cho Change Password
      { path: "change-password", element: <ChangePassword /> },
    ],
  },
  { path: "/login", element: <Login /> },
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
