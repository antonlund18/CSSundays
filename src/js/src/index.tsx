import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavigationBar} from "./pages/navbar/NavigationBar";
import {BrowserRouter} from "react-router-dom";
import {Router} from "./router/Router";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./theme/theme";
import {AuthProvider} from "./firebase/authentication/AuthContext";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <NavigationBar/>
                    <Router/>
                </MuiThemeProvider>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);