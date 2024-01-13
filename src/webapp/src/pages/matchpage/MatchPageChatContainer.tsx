import * as React from "react"
import {useEffect, useState} from "react"
import {Grid, TextField, Tooltip, Typography} from "@mui/material";
import {SubdirectoryArrowLeft} from "@mui/icons-material";
import {
    Match,
    MatchChatMessage,
    useOnNewMatchChatMessageSubscription,
    User,
    useSendChatMessageMutation
} from "../../codegen/generated-types";
import {useGetCurrentUser} from "../../hooks/api/useUser";

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

type MatchPageChatContainerProps = {
    match: Match
}

export const MatchPageChatContainer = (props: MatchPageChatContainerProps) => {
    const [message, setMessage] = useState<string>("")
    const {currentUser} = useGetCurrentUser()
    const [messages, setMessages] = useState<MatchChatMessage[]>(props.match.chatMessages)
    const {data} = useOnNewMatchChatMessageSubscription({variables: {matchId: props.match?.id ?? -1}})
    const [sendChatMessage] = useSendChatMessageMutation()

    useEffect(() => {
        if (data && !messages.find(message => message.id === data.onNewMatchChatMessage?.id)) {
            setMessages([...messages, data.onNewMatchChatMessage as MatchChatMessage])
        }
    }, [data])

    const handleSubmitMessage = () => {
        if (!currentUser) {
            return
        }
        sendChatMessage({
            variables: {
                matchId: props.match?.id ?? -1,
                senderId: currentUser?.id ?? -1,
                message: message
            }
        }).then(() => setMessage(""))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxLength = Math.min(e.target.value.length, 255)
        setMessage(e.target.value.substring(0, maxLength))
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            handleSubmitMessage()
        }
    }

    const getSenderColor = (sender: User): "primary" | "error" => {
        const isSenderOnTeamOne = props.match.tournamentRegistration1?.players.find(player => player.id === sender.id)
        return isSenderOnTeamOne ? "primary" : "error"
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
                paddingBottom: "0px",
                display: "flex",
                width: "100%",
                flexDirection: "column-reverse",
            }}>
                {/* Reverse list and set 'column-reverse' on parent, to show new messages last and have a nice auto-scroll */}
                {messages.slice().reverse().map(message => {
                    return <div
                        style={{whiteSpace: "pre-wrap", width: "100%", overflowWrap: "break-word"}}>
                            <Typography color={getSenderColor(message.sender)} style={{display: "inline"}}
                                        fontWeight={"bold"}>{`${message.sender.playertag}: `}</Typography>
                            <Typography style={{display: "inline"}}>{message.message}</Typography>
                    </div>
                })}
            </div>
            <div style={{height: "10%", paddingLeft: "8px", paddingRight: "8px"}}>
                <TextField variant={"standard"} style={{width: "100%"}}
                           value={message}
                           autoComplete={"off"}
                           onChange={handleChange}
                           onKeyPress={e => handleKeyPress(e)}
                           InputProps={{
                               disableUnderline: true,
                               endAdornment: <Tooltip title={"Send besked"} arrow placement={"top"}>
                                   <SubdirectoryArrowLeft style={{fontSize: "120%", cursor: "pointer"}}
                                                          onClick={handleSubmitMessage}/>
                               </Tooltip>
                           }}/>
            </div>
        </div>
    </Grid>
}