import * as React from "react"
import {Grid, TextField, Tooltip, Typography} from "@mui/material";
import {SubdirectoryArrowLeft} from "@mui/icons-material";
import {useEffect, useState} from "react";

enum Color {
    RED,
    BLUE
}

type Message = {
    sender: string,
    message: string
    color: Color
}

const messagesDemo: Message[] = [
    {
        sender: "Anton",
        message: "Anton er mega sej",
        color: Color.RED
    },
    {
        sender: "xXxDrag0nSl4yerxXx",
        message: "Kan vi ikke godt banne nuke???? :(((",
        color: Color.BLUE
    },
]

export const MatchPageChatContainer = () => {
    const [message, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const sorted = new Array(100).fill(messagesDemo).flat().sort(() => Math.random() > 0.5 ? 1 : -1)
        setMessages(sorted)
    }, [])

    const handleSubmitMessage = () => {
        setMessage("")
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            handleSubmitMessage()
        }
    }

    return <Grid item xs={12}>
        <Typography variant={"subtitle2"} sx={{textTransform: "none"}}>Chat</Typography>
        <div style={{
            width: "100%",
            height: "30vh",
            border: "1px solid gray",
            backgroundColor: "white",
            borderRadius: "4px"
        }}>
            <div style={{
                height: "90%",
                borderBottom: "1px solid gray",
                overflowY: "scroll",
                padding: "8px",
                paddingBottom: "0px"
            }}>

                {messages.map(message => {
                    return <div style={{display: "flex", whiteSpace: "pre"}}>
                        <Typography color={message.color === Color.BLUE ? "primary" : "error"}
                                    fontWeight={"bold"}>{`${message.sender}: `}</Typography>
                        <Typography>{message.message}</Typography>
                    </div>
                })}
            </div>
            <div style={{height: "10%", paddingLeft: "8px", paddingRight: "8px"}}>
                <TextField variant={"standard"} style={{width: "100%"}}
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           onKeyPress={e => handleKeyPress(e)}
                           InputProps={{
                               disableUnderline: true,
                               endAdornment: <Tooltip title={"Send besked"} arrow placement={"top"}>
                                   <SubdirectoryArrowLeft style={{fontSize: "120%", cursor: "pointer"}} onClick={handleSubmitMessage}/>
                               </Tooltip>
                           }}/>
            </div>
        </div>
    </Grid>
}