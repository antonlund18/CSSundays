import * as React from "react"
import {Typography} from "@mui/material";
import {Match, MatchInProgressPhaseState} from "../../../codegen/generated-types";
import {mapPool} from "../../../util/MapPool";

type MatchPageInProgressPhaseProps = {
    match: Match
}

export const MatchPageInProgressPhase = (props: MatchPageInProgressPhaseProps) => {

    const state = props.match.currentPhase.state as MatchInProgressPhaseState

    if (!state.map) {
        return <></>
    }

    const map = mapPool[state.map]

    return <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    }}>
        <Typography variant={"h2"}>Kamp I gang</Typography>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: "50%",
            marginTop: "16px"
        }}>
            <Typography variant={"h2"} style={{zIndex: 1, textShadow: "#FFFFFF 0px 0px 10px"}}>{map.label}</Typography>
            <img src={map.picture} style={{
                position: "absolute",
                height: "100%",
                aspectRatio: "2/1",
                marginTop: "16px",
                objectFit: "cover",
                zIndex: 0,
                opacity: "70%",
            }}/>
        </div>
    </div>
}
