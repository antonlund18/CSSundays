import {Divider, Grid, Typography} from "@mui/material";
import * as React from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {makeStyles} from "@mui/styles";
import {useParams} from "react-router-dom";
import {useGetMatchById} from "../../hooks/api/useMatch";
import {MagePageTeamPosition, MatchPageTeam} from "./MatchPageTeam";
import {MatchPagePhaseContainer} from "./MatchPagePhaseContainer";
import {MatchPageChatContainer} from "./MatchPageChatContainer";
import {Error404} from "../Error404";

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
    const {match, loading} = useGetMatchById(parseInt(urlParams?.matchId ?? "-1"))

    if (loading) {
        return <></>
    }

    if (!match) {
        return <Error404/>
    }

    return <CenteredPage>
        <Grid container xs={12}>
            <MatchPageTeam position={MagePageTeamPosition.LEFT} team={match.tournamentRegistration1?.team}/>
            <Grid item xs={2} className={classes.vsContainer}>
                <Typography variant={"h2"}>VS</Typography>
            </Grid>
            <MatchPageTeam position={MagePageTeamPosition.RIGHT} team={match.tournamentRegistration2?.team}/>
        </Grid>
        <Divider sx={{marginTop: "16px"}}/>
        <MatchPagePhaseContainer match={match}/>
        <Divider sx={{margin: "16px"}}/>
        <Grid container xs={12}>
            <MatchPageChatContainer/>
        </Grid>
    </CenteredPage>
}