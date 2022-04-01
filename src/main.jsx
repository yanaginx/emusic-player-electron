import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { EPlayerProvider } from "./contexts/EPlayerContext";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <EPlayerProvider>
        <App />
      </EPlayerProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
