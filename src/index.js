import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/reset.css";
import { App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { store } from "./redux/store";



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AntdApp>
    <Provider store={store}>
      <App />
    </Provider>
  </AntdApp>
);

reportWebVitals();
