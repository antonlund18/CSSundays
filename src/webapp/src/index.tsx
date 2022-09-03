import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavigationBar} from "./pages/navbar/NavigationBar";
import {BrowserRouter} from "react-router-dom";
import {Router} from "./router/Router";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./theme/theme";
import {ApolloClientProvider} from "./ApolloClientProvider";

ReactDOM.render(
    <React.StrictMode>
            <ApolloClientProvider>
                <BrowserRouter>
                    <MuiThemeProvider theme={theme}>
                        <NavigationBar/>
                        <Router/>
                    </MuiThemeProvider>
                </BrowserRouter>
            </ApolloClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
);