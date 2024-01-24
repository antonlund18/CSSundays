import * as React from "react"
import {IconButton, Typography} from "@mui/material";
import {
    InviteToTeamStatus,
    NotificationType,
    ObjectType,
    useGetAllNotificationsQuery,
    User
} from "../../../codegen/generated-types";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useDateFormatter} from "../../../hooks/useDateFormatter";
import {Check, Clear} from "@mui/icons-material";
import {useInviteToTeamMutation} from "../../../hooks/api/useInviteToTeam";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
    teamName: {
        "&:hover": {
            color: theme.palette.primary.main
        },
        textTransform: "none",
        cursor: "pointer"
    },
    senderName: {
        "&:hover": {
            color: theme.palette.primary.main
        },
        cursor: "pointer",
        textTransform: "none",
        fontSize: "10px",
        display: "inline"
    }
}))

type PlayerTeamsTabInviteListProps = {
    player: User
}

export const PlayerTeamsTabInviteList = (props: PlayerTeamsTabInviteListProps): JSX.Element => {
    const {data} = useGetAllNotificationsQuery({variables: {userId: props.player?.id ?? -1}})
    const {formatDateRelatively} = useDateFormatter()
    const {acceptInvitation, declineInvitation} = useInviteToTeamMutation();
    const navigate = useNavigate()
    const classes = useStyles()

    if (!data) {
        return <></>
    }

    const invites = data.getAllNotifications.filter(notification => notification.notificationType === NotificationType.InviteToTeam && notification.notifiableObject?.status === InviteToTeamStatus.Pending)

    return <>
        <Typography variant={"h2"}>{`Holdinvitationer (${invites.length})`}</Typography>

        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            overflowY: "scroll",
            height: "100%",
        }}>
            {invites.slice().reverse().map(invite => {
                return <div
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        margin: "8px",
                        border: "1px solid gray",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "64px",
                    }}
                >
                    <div style={{height: "100%", display: "flex", alignItems: "center"}}>
                        <img
                            src={getPictureLinkFromKey(invite.notifiableObject?.team.picture ?? "", ObjectType.Team)}
                            onClick={() => navigate(`/teams/${invite.notifiableObject?.team?.id}`)}
                            style={{
                                height: "100%",
                                cursor: "pointer"
                            }}/>
                        <div style={{display: "flex", flexDirection: "column", marginLeft: "8px"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Typography variant={"h4"}
                                            className={classes.teamName}
                                            fontWeight={"bold"}
                                            onClick={() => navigate(`/teams/${invite.notifiableObject?.team?.id}`)}
                                >
                                    {invite.notifiableObject?.team.name}
                                </Typography>
                            </div>

                            <div>
                                <Typography variant={"subtitle2"} style={{display: "inline", textTransform: "none", fontSize: "10px"}}>
                                    Inviteret af: {' '}
                                </Typography>
                                <Typography variant={"subtitle2"} className={classes.senderName} onClick={() => navigate(`/players/${invite.notifiableObject?.sender.id}`)}>
                                    {invite.notifiableObject?.sender.playertag}
                                </Typography>
                            </div>

                            <Typography variant={"subtitle2"}
                                        style={{
                                            textTransform: "none",
                                            fontSize: "10px"
                                        }}>{formatDateRelatively(invite.createdTs)}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <IconButton style={{color: "green", borderRadius: "0%"}} size={"small"}
                                    onClick={() => acceptInvitation(invite.notifiableObject?.id ?? -1)}>
                            <Check/>
                        </IconButton>
                        <IconButton style={{color: "red", borderRadius: "0%", marginRight: "8px"}} size={"small"}
                                    onClick={() => declineInvitation(invite.notifiableObject?.id ?? -1)}>
                            <Clear/>
                        </IconButton>
                    </div>
                </div>
            })}
        </div>

    </>
}