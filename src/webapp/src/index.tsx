import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavigationBar} from "./pages/navbar/NavigationBar";
import {BrowserRouter} from "react-router-dom";
import {Router} from "./router/Router";
import {CssBaseline, MuiThemeProvider} from "@material-ui/core";
import {theme} from "./theme/theme";
import {ApolloClientProvider} from "./ApolloClientProvider";

ReactDOM.render(
    <React.StrictMode>
        <ApolloClientProvider>
            <BrowserRouter>
                <CssBaseline>
                    <MuiThemeProvider theme={theme}>
                        <NavigationBar/>
                        <Router/>
                    </MuiThemeProvider>
                </CssBaseline>
            </BrowserRouter>
        </ApolloClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
);