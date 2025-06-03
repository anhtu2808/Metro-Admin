import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/reset.css";
import { App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { store } from "./app/store";
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import AdminPage from "./pages/Admin/AdminPage";
import HomePage from "./pages/Home/HomePage";
import Dashboard from "./pages/Admin/content/Dashboard";
import ManageUser from "./pages/Admin/content/ManageUser/ManageUser";
import MetroRoutes from "./pages/Admin/content/MetroRoutes";
import BusRoutes from "./pages/Admin/content/BusRoutes";
import TicketPrice from "./pages/Admin/content/TicketPrice";
import LoginPage from "./pages/Login/LoginPage";

// 🧪 Kích hoạt mock nếu được bật trong .env
if (process.env.REACT_APP_USE_MOCK === "true") {
  require("./services/mock");
}

const root = ReactDOM.createRoot(document.getElementById("root"));

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/admins",
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

root.render(
  // <React.StrictMode>
  <AntdApp>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </AntdApp>
  // </React.StrictMode>
);

reportWebVitals();
