import * as React from "react";
import {useCallback} from "react";
import {Button, Dialog, DialogContent, Divider as MuiDivider, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {CenteredPage} from "../../components/CenteredPage";
import {InviteToTeamStatus, ObjectType, User} from "../../codegen/generated-types";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {useFindAllInvitesForPlayer, useInviteToTeamMutation} from "../../hooks/api/useInviteToTeam";

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
    teamInfo: {
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
    },
    teamName: {
        lineHeight: "32px",
        maxWidth: "260px",
        overflow: "hidden",
    }
}))

interface PlayerInviteDialogProps {
    setDialogOpen: (open: boolean) => void,
    targetPlayer: User
}

export const PlayerInviteDialog = (props: PlayerInviteDialogProps): JSX.Element => {
    const classes = useStyles();
    const {currentUser} = useGetCurrentUser();
    const {createInviteToTeam} = useInviteToTeamMutation()
    const {allInvitesForPlayer} = useFindAllInvitesForPlayer(props.targetPlayer.id ?? -1)

    const shouldDisableInviteButton = useCallback((teamId: number | null | undefined) => {
        const playerInvitesByTeam = allInvitesForPlayer?.filter(invite => invite.team.id === teamId);
        const playerHasPendingInvite = playerInvitesByTeam?.find(invite => invite.status === InviteToTeamStatus.Pending)
        const playerIsAlreadyOnTeam = props.targetPlayer.teams.find(team => team.id === teamId);

        return !(!playerHasPendingInvite && !playerIsAlreadyOnTeam)
    }, [allInvitesForPlayer, props.targetPlayer.teams])

    if (!currentUser) {
        return <CenteredPage/>;
    }

    const handleInvite = (teamId: number | null | undefined) => {
        if (props.targetPlayer.id && teamId && currentUser.id) {
            createInviteToTeam(props.targetPlayer.id, teamId, currentUser.id)
        }
    }

    const teamsSorted = currentUser.teams.slice().sort((team1, team2) => team1.name < team2.name ? -1 : 1);

    return <Dialog open={true}
                   onClose={() => props.setDialogOpen(false)}
                   className={classes.inviteDialog}
                   maxWidth={"xl"}>
        <DialogContent>
            <Typography variant={"subtitle1"}>Vælg hold</Typography>
            {teamsSorted.map((team, index) => {
                return <React.Fragment>
                    <div className={classes.teamContainer}>
                        <div className={classes.teamInfo}>
                            <img src={getPictureLinkFromKey(team.picture, ObjectType.Team) ?? "asd"} className={classes.teamImage} aria-label={"Team picture"}/>
                            <Typography variant={"subtitle2"} className={classes.teamName}>{team.name}</Typography>
                        </div>
                        <Button variant={"outlined"} color={"primary"} style={{height: "32px"}} disabled={shouldDisableInviteButton(team.id)} onClick={() => handleInvite(team?.id)}>Inviter</Button>
                    </div>
                    {currentUser.teams?.length != index + 1 ? <MuiDivider className={classes.MuiDivider}/> : <></>}
                </React.Fragment>
            })}
        </DialogContent>
    </Dialog>
}