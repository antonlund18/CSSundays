import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavigationBar} from "./pages/navbar/NavigationBar";
import {BrowserRouter} from "react-router-dom";
import {Router} from "./router/Router";
import {CssBaseline} from "@mui/material";
import {theme} from "./theme/theme";
import {ApolloClientProvider} from "./ApolloClientProvider";
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import {Theme} from '@mui/material/styles';
import {SnackbarContextProvider} from "./SnackbarContextProvider";

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <SnackbarContextProvider>
            <ThemeProvider theme={theme}>
                <React.StrictMode>
                    <ApolloClientProvider>
                        <BrowserRouter>
                            <CssBaseline>
                                <NavigationBar/>
                                <Router/>
                            </CssBaseline>
                        </BrowserRouter>
                    </ApolloClientProvider>
                </React.StrictMode>
            </ThemeProvider>
        </SnackbarContextProvider>
    </StyledEngineProvider>,
    document.getElementById('root')
)
;

declare module '@mui/styles/defaultTheme' {
    // @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {
    }
}