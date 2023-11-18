import * as React from "react"
import {AlertColor, Snackbar} from "@mui/material";
import {Alert} from "./components/Alert";
import {createContext, useState} from "react";

export type SnackbarContextState = {
    openSnackbar: (text: string, severity: AlertColor) => void
}

export const SnackbarContext = createContext<SnackbarContextState>({
    openSnackbar: (text: string, severity: AlertColor) => {},
})

export const SnackbarContextProvider = (props: React.PropsWithChildren<any>) => {
    const [open, setOpen] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [severity, setSeverity] = useState<AlertColor>("info")

    const openSnackbar = (text: string, severity: AlertColor) => {
        setSnackbarText(text)
        setSeverity(severity)
        setOpen(true)
    }

    const closeSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return
        }

        setOpen(false)
    }

    return <SnackbarContext.Provider value={{openSnackbar}}>
        <Snackbar open={open} autoHideDuration={3000} onClose={closeSnackbar}>
            <Alert severity={severity}>{snackbarText}</Alert>
        </Snackbar>
        {props.children}
    </SnackbarContext.Provider>
}