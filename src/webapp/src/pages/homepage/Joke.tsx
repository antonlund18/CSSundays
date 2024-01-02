import { Typography } from "@mui/material"
import * as React from "react"

export const Joke = () => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Comic Sans MS, Comic Sans",
        height: "100vh"
    }}>
        <Typography style={{fontFamily: "Comic Sans MS, Comic Sans", fontSize: "24px", color: "red"}}>til emma</Typography>
        <img src={"https://scontent.fcph2-1.fna.fbcdn.net/v/t39.30808-1/399910661_6874252019301337_1536759259685783510_n.jpg?stp=dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=5740b7&_nc_ohc=ffyOlDMXNBEAX-RJoz7&_nc_ht=scontent.fcph2-1.fna&oh=00_AfCI12cXcETVvj3iEmkB0kMqgdLCDLMLmhunUkgQWaXUow&oe=659A19CC"}/>
        <Typography style={{fontFamily: "Comic Sans MS, Comic Sans", fontSize: "24px", color: "green"}}>{"mit livs store kærlighed <'3"}</Typography>
    </div>
}