import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {Box, Button, Divider as MuiDivider, Grid, makeStyles, Theme, Tooltip, Typography} from "@material-ui/core";
import {calculateWinrate} from "../../helpers/helpers";
import {Divider as CSDivider} from "../../components/Divider";
import {useGetTeamById, useMutateTeam} from "../../hooks/api/useTeam";
import {ObjectType, User} from "../../codegen/generated-types";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {useSharedTeamAndUser} from "../../hooks/api/useSharedTeamAndUser";
import {useGetCurrentUser} from "../../hooks/api/useUser";

interface StylesProps {
    isCurrentUserOwner: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
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
        padding: theme.spacing(1),
    },
    teamPicture: props => ({
        width: "344px",
        height: "344px",
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        cursor: props.isCurrentUserOwner ? "pointer" : "default"
    }),
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
    const navigate = useNavigate();
    const urlParams = useParams();

    const {team} = useGetTeamById(parseInt(urlParams.teamId ?? ""))
    const {setAndUploadPicture} = useSharedTeamAndUser();
    const {incrementWins, incrementLosses} = useMutateTeam();

    const {currentUser} = useGetCurrentUser();
    const isCurrenUserOwner = currentUser?.id === team?.owner?.id;

    const classes = useStyles({isCurrentUserOwner: isCurrenUserOwner});
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
        if (team) {
            const selector = document.createElement("input");
            selector.setAttribute("type", "file");
            selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            selector.addEventListener("change", async () => {
                if (team.id) {
                    await setAndUploadPicture(team.id, selector, ObjectType.Team)
                }
            })
            setFileSelector(selector);
        }
    }, [team])

    if (team === null) {
        return <CenteredPage/>
    }

    const handleFileSelect = () => {
        if (team?.owner?.id === currentUser?.id) {
            fileSelector?.click();
        }
    }

    const renderPlayerBox = (player: User) => {
        return <div key={player.playertag} className={classes.playerContainer}
                    onClick={() => navigate("/players/" + player.id)}>
            <Box boxShadow={1} className={classes.playerPicture}>
                <React.Fragment>
                    <img src={getPictureLinkFromKey(player.picture ?? null, ObjectType.User)} width={"100%"} height={"100%"}/>
                </React.Fragment>
            </Box>
            <Typography variant={"h4"}>{player.playertag}</Typography>
        </div>
    }

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"}>{team?.name}</Typography>
        <CSDivider/>
        <Grid container
              direction={"row"}
              justifyContent={"center"}
              alignItems={"stretch"}
              spacing={3}
        >
            <Grid item xs={12} md={4}>
                <Box boxShadow={3} className={classes.teamPicture} onClick={handleFileSelect}>
                    <Tooltip title={"Upload billede"} disableHoverListener={!isCurrenUserOwner} arrow>
                        <img src={getPictureLinkFromKey(team?.picture ?? "", ObjectType.Team)} width={"100%"}
                             height={"100%"}/>
                    </Tooltip>
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                <div className={classes.playersContainer}>
                    {team?.users?.map(user => {
                        return renderPlayerBox(user as User)
                    })}
                    <div className={classes.teamStatsContainer}>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Wins</Typography>
                            <Typography variant={"subtitle1"}>{team?.wins}</Typography>
                        </div>
                        <MuiDivider className={classes.MuiDivider}/>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Losses</Typography>
                            <Typography variant={"subtitle1"}>{team?.losses}</Typography>
                        </div>
                        <MuiDivider className={classes.MuiDivider}/>
                        <div className={classes.teamStats}>
                            <Typography variant={"subtitle1"}>Winrate</Typography>
                            <Typography variant={"subtitle1"}>{calculateWinrate(team?.wins, team?.losses)}</Typography>
                        </div>
                        <MuiDivider className={classes.MuiDivider}/>
                        <Button onClick={() => incrementWins(team?.id ?? -1)} color={"primary"} variant={"contained"}>+1
                            wins</Button>
                        <Button onClick={() => incrementLosses(team?.id ?? -1)} color={"primary"} variant={"contained"}>+1
                            losses</Button>
                    </div>
                </div>
            </Grid>
        </Grid>
    </CenteredPage>
}