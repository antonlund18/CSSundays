import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {Box, Divider as MuiDivider, Grid, makeStyles, Typography} from "@material-ui/core";
import {usePlayersCollection, useTeamsCollection} from "../../firebase/database/database";
import {Team} from "../../firebase/database/TeamsHandler";
import {calculateWinrate} from "../../helpers/helpers";
import {Divider as CSDivider} from "../../components/Divider";
import {Player} from "../../firebase/database/PlayersHandler";

const useStyles = makeStyles(theme => ({
    playersContainer: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
    },
    playerContainer: {
        width: "132px",
        cursor: "pointer",
        textAlign: "center",
    },
    playerPicture: {
        height: "132px",
        width: "100%",
        margin: theme.spacing(1),
        padding: theme.spacing(2),
    },
    teamPicture: {
        width: "344px",
        height: "344px",
        margin: theme.spacing(1),
        padding: theme.spacing(2),
    },
    teamStatsContainer: {
        width: "100%",
        marginTop: theme.spacing(3),
    },
    teamStats: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    },
    MuiDivider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }

}))

export const TeamPage = (): JSX.Element => {
    const urlParams = useParams();
    const classes = useStyles();
    const navigate = useNavigate();
    const teamsDatabase = useTeamsCollection();
    const playersDatabase = usePlayersCollection();
    const [team, setTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<Player[] | null>(null);

    useEffect(() => {
        if (urlParams.team) {
            teamsDatabase.getTeamByName(urlParams.team)
                .then(data => setTeam(data))
        }
    }, []);

    useEffect(() => {
        if (team) {
            playersDatabase.getPlayersById(team.playerIds)
                .then(data => {
                    setPlayers(data)
                })
        }
    }, [team]);

    if (team === null) {
        return <CenteredPage/>
    }

    const renderPlayerBox = (player: Player) => {
        return <div key={player.username} className={classes.playerContainer}
                    onClick={() => navigate("/players/" + player.username)}>
            <Box boxShadow={3} className={classes.playerPicture}>
                <React.Fragment>
                    <img src={player.picture} width={"100%"} height={"100%"}/>
                </React.Fragment>
            </Box>
            <Typography variant={"h4"}>{player.username}</Typography>
        </div>
    }

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"}>{team.name}</Typography>
        <CSDivider/>
        <Grid container
              direction={"row"}
              justifyContent={"center"}
              alignItems={"stretch"}
              spacing={3}
        >
            <Grid item xs={12} md={4}>
                <Box boxShadow={3} className={classes.teamPicture}>
                    <img src={team.picture} width={"100%"} height={"100%"}/>
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                <div className={classes.playersContainer}>
                    {players?.map(player => {
                        return renderPlayerBox(player)
                    })}
                    <div className={classes.teamStatsContainer}>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Point</Typography>
                            <Typography variant={"subtitle1"}>{team.points}</Typography>
                        </div>
                        <MuiDivider className={classes.MuiDivider}/>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Wins</Typography>
                            <Typography variant={"subtitle1"}>{team.wins}</Typography>
                        </div>
                        <MuiDivider className={classes.MuiDivider}/>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Losses</Typography>
                            <Typography variant={"subtitle1"}>{team.losses}</Typography>
                        </div>
                        <MuiDivider className={classes.MuiDivider}/>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Winrate</Typography>
                            <Typography variant={"subtitle1"}>{calculateWinrate(team.wins, team.losses)}</Typography>
                        </div>
                    </div>
                </div>
            </Grid>

        </Grid>
    </CenteredPage>
}