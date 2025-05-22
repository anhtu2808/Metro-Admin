import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/reset.css";
import { App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { store } from "./app/store";

// 🧪 Kích hoạt mock nếu được bật trong .env
if (process.env.REACT_APP_USE_MOCK === "true") {
  require("./services/mock");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AntdApp>
      <Provider store={store}>
        <App />
      </Provider>
    </AntdApp>
  </React.StrictMode>
);

reportWebVitals();
