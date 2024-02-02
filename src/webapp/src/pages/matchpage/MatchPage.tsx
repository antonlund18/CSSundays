import {Divider, Grid, IconButton, Typography} from "@mui/material";
import * as React from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import {useGetMatchById} from "../../hooks/api/useMatch";
import {MatchPageTeam, MatchPageTeamPosition} from "./MatchPageTeam";
import {MatchPagePhaseContainer} from "./MatchPagePhaseContainer";
import {MatchPageChatContainer} from "./MatchPageChatContainer";
import {Error404} from "../Error404";
import {Divider as CSDivider} from "../../components/Divider";
import {Tournament, useGetTournamentByMatchQuery} from "../../codegen/generated-types";
import {ArrowBack} from "@mui/icons-material";

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
    const {data: tournamentData, loading: tournamentLoading} = useGetTournamentByMatchQuery({
        variables: {
            matchId: match?.id ?? -1
        }
    })
    const navigate = useNavigate()

    if (loading || tournamentLoading) {
        return <></>
    }

    if (!match) {
        return <Error404/>
    }
    const tournament: Tournament | undefined = tournamentData?.getTournamentByMatch as Tournament

    return <CenteredPage>
        {tournament &&
            <Grid item xs={12}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <IconButton color={"primary"} onClick={() => navigate(`/tournaments/${tournament.id}#bracket`)}>
                        <ArrowBack/>
                    </IconButton>
                    <Typography variant={"h2"} color={"primary"} style={{marginLeft: "16px"}}>{tournament.name}</Typography>
                </div>
                <CSDivider/>
            </Grid>
        }
        <Grid container xs={12}>
            <MatchPageTeam position={MatchPageTeamPosition.LEFT} team={match.tournamentRegistration1?.team}
                           players={match.tournamentRegistration1?.players ?? []}/>
            <Grid item xs={2} className={classes.vsContainer}>
                <Typography variant={"h2"}>VS</Typography>
            </Grid>
            <MatchPageTeam position={MatchPageTeamPosition.RIGHT} team={match.tournamentRegistration2?.team}
                           players={match.tournamentRegistration2?.players ?? []}/>
        </Grid>
        <Divider sx={{marginTop: "16px"}}/>
        <MatchPagePhaseContainer match={match}/>
        <Divider sx={{marginTop: "16px", marginBottom: "16px"}}/>
        <Grid container xs={12}>
            <MatchPageChatContainer match={match}/>
        </Grid>
    </CenteredPage>
}