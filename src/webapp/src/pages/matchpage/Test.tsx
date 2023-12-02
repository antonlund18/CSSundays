import {Typography} from "@mui/material";
import * as React from "react";


export const Test = (props: {countdown: number | null}) => {
    return <Typography variant={"h4"} style={{textTransform: "none"}}>{`BAN EN MAP (${props.countdown}s)`}</Typography>
}