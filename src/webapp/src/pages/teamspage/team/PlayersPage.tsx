import * as React from "react"
import {useGetTeamById} from "../../../hooks/api/useTeam";
import {useParams} from "react-router-dom";
import {Button, Grid, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {Divider as CSDivider} from "../../../components/Divider";
import {CenteredPage} from "../../../components/CenteredPage";

const useStyles = makeStyles(theme => ({
    emptyPlayersContainer: {
        height: "30vh",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
}))

export const PlayersPage = (): JSX.Element => {
    const urlParams = useParams();
    const {team} = useGetTeamById(parseInt(urlParams.teamId ?? ""))
    const classes = useStyles();

    return <CenteredPage>
        <Grid container
              justifyContent={"center"}
              spacing={0}
        >
            <Grid item xs={12}>
                <Typography variant={"h2"} color={"primary"}>{team?.name + " - spillere"}</Typography>
                <CSDivider/>
            </Grid>
            <Grid item xs={12} className={classes.emptyPlayersContainer}>
                <Typography variant={"h2"}>Under udvikling 🔨</Typography>
                <br/>
                <Button variant={"outlined"} onClick={() => window.history.back()}>Gå tilbage</Button>
            </Grid>
        </Grid>
    </CenteredPage>
}