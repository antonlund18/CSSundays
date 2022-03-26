import {createTheme} from "@material-ui/core";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#1c95f3",
            light: "#3ca4f5",
        },
        secondary: {
            main: "#f30a5c",
            light: "#fc4a8a",
        }
    },
    spacing: 8,
    typography: {
        subtitle1: {
            fontFamily: 'Exo, sans-sarif',
            fontWeight: 700,
            fontSize: 18,
            textTransform: "uppercase",
        },
        subtitle2: {
            fontFamily: 'Exo, sans-sarif',
            fontWeight: 700,
            fontSize: 11,
            textTransform: "uppercase",
        },
        h1: {
            fontFamily: 'Exo, sans-sarif',
            fontWeight: 700,
            fontSize: 48,
            textTransform: "uppercase",
        },
        h2: {
            fontFamily: 'Exo, sans-sarif',
            fontWeight: 700,
            fontSize: 24,
            textTransform: "uppercase",
        },
        h4: {
            fontFamily: 'Exo, sans-sarif',
            fontWeight: 700,
            fontSize: 14,
            textTransform: "uppercase",
        },
        body1: {
            fontFamily: 'Roboto, sans-serif',
            fontSize: 13,
            color: "rgba(0, 0, 0, 0.87)",
        },
        button: {
            fontFamily: 'Exo, sans-sarif',
            fontSize: 13,
            fontWeight: 700
        },
    }
})