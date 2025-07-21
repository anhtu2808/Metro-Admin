import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import LineManagement from "./pages/LineManagement/LineManagement";
import RoleManagement from "./pages/RoleManagement/RoleManagement";
import Login from "./pages/Login/Login";
import MainLayout from "./components/MainLayout/MainLayout";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyInfo } from "./redux/userSlice";
import PrivateRoute from "./components/PrivateRoute";
import UserManagement from "./pages/UserManagement/UserManagement";
import BusRouteManagement from "./pages/BusRouteManagement/BusRouteManagement";
import PriceManagement from "./pages/PriceManagement/PriceManagement";
import StationManagement from "./pages/StationManagement/StationManagement";
import ContentManagement from "./pages/ContentManagement/ContentManagement";
import EditProfile from "./pages/EditProfile/EditProfile";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import DevPage from "./pages/DevPage/DevPage";
import TicketManagement from "./pages/TicketManagement/TicketManagement";
import QRGenerator from "./pages/QRGenerator/QRGenerator";
import MetroGatewayScanner from "./pages/MetroGatewayScanner/MetroGatewayScanner";


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
      { path: "price-management", element: <PriceManagement /> },
      { path: "ticket-management", element: <TicketManagement /> },
      { path: "role-management", element: <RoleManagement /> },

      // ✅ Thêm route cho Staff
      { path: "staff/content", element: <ContentManagement /> },
      
      // ✅ Thêm route cho Edit Profile
      { path: "edit-profile", element: <EditProfile /> },
      
      // ✅ Thêm route cho Change Password
      { path: "change-password", element: <ChangePassword /> },
      
      // ✅ Thêm route cho Developer Tools
      { path: "dev", element: <DevPage /> },
      
      // ✅ Thêm route cho QR Generator
      { path: "qr-generator", element: <QRGenerator /> },
      
      // ✅ Thêm route cho Metro Gateway Scanner
      { path: "metro-gateway-scanner", element: <MetroGatewayScanner /> },
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
