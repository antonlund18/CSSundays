import * as React from "react"
import {Typography} from "@mui/material";

type EmptySearchProps = {
    query: string
}

export const EmptySearch = (props: EmptySearchProps) => {
    const {query} = props

    return <div style={{height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography variant={"subtitle1"} style={{textTransform: "none"}}>Ingen resultater for '{query}'</Typography>
        <Typography variant={"h4"} style={{textTransform: "none"}}>Prøv igen</Typography>
    </div>
}