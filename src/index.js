import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { App as AntdApp } from "antd";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "antd/dist/reset.css";
import "react-perfect-scrollbar/dist/css/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AntdApp>
    <Provider store={store}>
      <App />
    </Provider>
  </AntdApp>
);

reportWebVitals();
