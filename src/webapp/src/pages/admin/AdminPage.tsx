import * as React from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {Grid, Typography} from "@mui/material";
import {Divider} from "../../components/Divider";
import {makeStyles} from "@mui/styles";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    parent: {
        "& div:first-child:hover": {
            transform: "scale(1.2)"
        },
        overflow: "hidden",
    },
    base: {
        width: "100%",
        height: "70vh",
        backgroundImage: "url(https://i.imgur.com/MkE9cBw.png)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .5s",
        cursor: "pointer",
    },
    tournaments: {
        backgroundPosition: "0% 50%"
    },
    teams: {
        backgroundPosition: "50% 50%"
    },
    players: {
        backgroundPosition: "100% 50%"
    }
}))

export const AdminPage = (): JSX.Element => {
    const classes = useStyles()
    const navigate = useNavigate()

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"}>Admin side</Typography>
        <Divider/>
        <Grid container spacing={4}>
            <Grid item xs={4}>
                <div className={classes.parent} onClick={() => navigate("tournaments")}>
                    <div className={classes.base + " " + classes.tournaments}>
                        <Typography variant={"h4"} color={"primary"}>Rediger</Typography>
                        <Typography variant={"h2"} sx={{color: "white"}}>Turneringer</Typography>
                    </div>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className={classes.parent}>
                    <div className={classes.base + " " + classes.teams}>
                        <Typography variant={"h4"} color={"primary"}>Rediger</Typography>
                        <Typography variant={"h2"} sx={{color: "white"}}>Hold</Typography>
                    </div>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className={classes.parent}>
                    <div className={classes.base + " " + classes.players}>
                        <Typography variant={"h4"} color={"primary"}>Rediger</Typography>
                        <Typography variant={"h2"} sx={{color: "white"}}>Spillere</Typography>
                    </div>
                </div>
            </Grid>
        </Grid>
    </CenteredPage>
}