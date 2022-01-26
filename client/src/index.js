import React  from "react";
import ReactDom from "react-dom";
import App from "./App";
import GlobalStyle from "./Styles/GlobalStyle";


ReactDom.render(
    <React.StrictMode>
        <GlobalStyle />
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);