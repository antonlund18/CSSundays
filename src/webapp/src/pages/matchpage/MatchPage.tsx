import {Divider, Grid, Typography} from "@mui/material";
import * as React from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {makeStyles} from "@mui/styles";
import {useParams} from "react-router-dom";
import {useGetMatchById} from "../../hooks/api/useMatch";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {ObjectType} from "../../codegen/generated-types";
import {MagePageTeamPosition, MatchPageTeam} from "./MatchPageTeam";
import { MatchPagePhaseContainer } from "./MatchPagePhaseContainer";
import { MatchPageChatContainer } from "./MatchPageChatContainer";

const useStyles = makeStyles({
    teamContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
    },
    vsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    teamPicture: {
        border: "2px solid white",
        height: "96px",
        width: "96px",
        objectFit: "cover",
        marginLeft: "16px",
        marginRight: "16px",
    },
    playerPicture: {
        borderRadius: "50%",
        border: "2px solid white",
        aspectRatio: "1/1",
        width: "60%",
        objectFit: "cover",
        marginLeft: "16px",
        marginRight: "16px",
    },
})

export const MatchPage = () => {
    const classes = useStyles()
    const urlParams = useParams()
    const {match} = useGetMatchById(parseInt(urlParams?.matchId ?? "-1"))

    if (!match) {
        return <></>
    }

    return <CenteredPage>
        <Grid container xs={12}>
            <MatchPageTeam position={MagePageTeamPosition.LEFT} team={match.team1}/>
            <Grid item xs={2} className={classes.vsContainer}>
                <Typography variant={"h2"}>VS</Typography>
            </Grid>
            <MatchPageTeam position={MagePageTeamPosition.RIGHT} team={match.team2}/>
        </Grid>
        <Divider sx={{marginTop: "16px"}}/>
        <Grid container xs={12}>
            <MatchPagePhaseContainer/>
        </Grid>
        <Divider sx={{margin: "16px"}}/>
        <Grid container xs={12}>
            <MatchPageChatContainer/>
        </Grid>
    </CenteredPage>
}