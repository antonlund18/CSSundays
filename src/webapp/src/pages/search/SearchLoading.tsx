import * as React from "react"
import {CircularProgress, Typography} from "@mui/material";

export const SearchLoading = () => {
    return <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress/>
    </div>
}