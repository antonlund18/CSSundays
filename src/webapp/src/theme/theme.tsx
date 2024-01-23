import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#1c95f3",
            light: "#3ca4f5",
        },
        secondary: {
            main: "#f30a5c",
            light: "#fc4a8a",
        },
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
            fontFamily: 'Exo, sans-sarif',
            fontSize: 13,
            color: "rgba(0, 0, 0, 0.87)",
        },
        body2: {
            fontFamily: 'Exo, sans-sarif',
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.87)",
            fontWeight: 700,
        },
        button: {
            fontFamily: 'Exo, sans-sarif',
            fontSize: 13,
            fontWeight: 700
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    "&::-webkit-scrollbar": {
                        width: "4px"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#1c95f3",
                    },
                }
            }
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    "&::-webkit-scrollbar": {
                        width: "4px"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#1c95f3",
                    }
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                FormHelperTextProps: {
                    style: {
                        marginLeft: "0px",
                    },
                },
            },
        }
    },
})