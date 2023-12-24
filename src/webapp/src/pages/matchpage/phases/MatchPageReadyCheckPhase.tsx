import * as React from "react"
import {makeStyles} from "@mui/styles";
import {User} from "../../../codegen/generated-types";
import {Box, CircularProgress, Grid, Typography} from "@mui/material";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {Check} from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
    captain: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    captainSpinner: {
        top: "50%",
        left: "50%",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
    }
}))

type MatchPageReadyCheckPhaseProps = {
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPageReadyCheckPhase = (props: MatchPageReadyCheckPhaseProps) => {
    const classes = useStyles()


    return <Grid container sx={{height: "100%", justifyContent: "center", alignItems: "center"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "center"}}>
            {props.team1Captain &&
                <Box className={classes.captain}>
                    <Box className={classes.captainSpinner}>
                        <CircularProgress style={{zIndex: 100}}/>
                    </Box>
                    <PlayerPicture player={props.team1Captain} style={{width: "100px"}}/>
                </Box>}
        </Grid>
        <Grid item xs={4} sx={{display: "flex", textAlign: "center"}}>
            <Typography variant={"h2"}>Venter på hold bliver klar</Typography>
        </Grid>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "center"}}>
            {props.team2Captain &&
                <Box className={classes.captain}>
                    <Box className={classes.captainSpinner}>
                        <Check style={{fontSize: "48px", color: "#39c900"}}/>
                    </Box>
                    <PlayerPicture player={props.team2Captain} style={{width: "100px"}}/>
                </Box>}
        </Grid>
    </Grid>
}