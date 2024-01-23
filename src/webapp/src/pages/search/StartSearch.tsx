import * as React from "react"
import {Typography} from "@mui/material";

export const StartSearch = () => {
    return <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography variant={"subtitle1"} style={{textTransform: "none"}}>Begynd din søgning ovenfor</Typography>
        <Typography variant={"h4"} style={{textTransform: "none"}}>Indtast mindst 3 tegn for at gå i gang</Typography>
    </div>
}