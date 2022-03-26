import * as React from "react";
import {useEffect, useState} from "react";
import {Button, Dialog, DialogContent, Divider as MuiDivider, makeStyles, Typography} from "@material-ui/core";
import {Player} from "../../firebase/database/PlayersHandler";
import {usePlayersCollection, useTeamsCollection} from "../../firebase/database/database";
import {useAuth} from "../../firebase/authentication/AuthContext";
import {CenteredPage} from "../../components/CenteredPage";
import {Team} from "../../firebase/database/TeamsHandler";

const useStyles = makeStyles(theme => ({
    inviteDialog: {
        maxHeight: "600px",
    },
    teamContainer: {
        marginTop: theme.spacing(1),
        width: "400px",
        display: "flex",
        justifyContent: "space-between",
    },
    teamName: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        height: "32px",
    },
    teamImage: {
        height: "32px",
        width: "32px",
        borderRadius: "50%",
        marginRight: theme.spacing(1),
    },
    MuiDivider: {
        width: "100%",
        marginTop: theme.spacing(1),
    }
}))

interface PlayerInviteDialogProps {
    setDialogOpen: (open: boolean) => void,
    player: Player
}

export const PlayerInviteDialog = (props: PlayerInviteDialogProps): JSX.Element => {
    const playerDatabase = usePlayersCollection();
    const teamDatabase = useTeamsCollection();
    const classes = useStyles();
    const {currentUser} = useAuth();
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [teams, setTeams] = useState<Team[] | null>(null);

    useEffect(() => {
        if (currentUser) {
            playerDatabase.getPlayerById(currentUser.uid).then(data => {
                setCurrentPlayer(data);
            });
        }
    }, [])

    useEffect(() => {
        if (currentPlayer) {
            teamDatabase.getTeamsById(currentPlayer.teamIds).then(data => {
                setTeams(data);
            })
        }
    }, [currentPlayer])

    if (!currentPlayer) {
        return <CenteredPage/>;
    }

    return <Dialog open={true}
                   onClose={() => props.setDialogOpen(false)}
                   className={classes.inviteDialog}
                   maxWidth={"xl"}>
        <DialogContent>
            <Typography variant={"subtitle1"}>Vælg hold</Typography>
            {teams?.map((team, index) => {
                return <React.Fragment>
                    <div className={classes.teamContainer}>
                        <div className={classes.teamName}>
                            <img src={team.picture} className={classes.teamImage}/>
                            <Typography variant={"subtitle2"} style={{lineHeight: "32px"}}>{team.name}</Typography>
                        </div>
                        <Button variant={"outlined"} color={"primary"} style={{height: "32px"}}>Inviter</Button>
                    </div>
                    {teams?.length != index + 1 ? <MuiDivider className={classes.MuiDivider}/> : <></>}
                </React.Fragment>
            })}
        </DialogContent>
    </Dialog>
}