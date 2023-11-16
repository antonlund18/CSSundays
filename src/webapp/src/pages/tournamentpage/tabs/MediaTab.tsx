import * as React from "react"
import {TwitchEmbed} from "react-twitch-embed";

const TWITCH_CHANNEL = "cssundays"

export const MediaTab = (): JSX.Element => {
    return <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
        <TwitchEmbed channel={TWITCH_CHANNEL} parent={["cssundays.dk", "www.cssundays.dk"]}/>
    </div>
}