import {Box, Divider, Icon, makeStyles, MenuItem, Typography} from "@material-ui/core";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {InvitationStatus, InviteToTeam, ObjectType} from "../../codegen/generated-types";
import {Link} from "react-router-dom";
import * as React from "react";
import {Check, Clear} from "@material-ui/icons";
import {useInviteToTeamMutation} from "../../hooks/api/useInviteToTeam";

const useStyles = makeStyles(theme => ({
    teamPicture: {
        width: "56px",
        height: "56px",
        marginRight: theme.spacing(1),
    },
    secondaryInformation: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    },
    container: {
        maxHeight: "200px",
        cursor: "default",
        width: "300px",
        wordBreak: "break-all"
    },
    accept: {
        "& :hover": {
            color: theme.palette.primary.light
        },
        color: theme.palette.primary.main,
        cursor: "pointer"
    },
    decline: {
        "& :hover": {
            color: theme.palette.secondary.light
        },
        color: theme.palette.secondary.main,
        cursor: "pointer"
    },
    actionContainer: {
        height: "24px",
        marginTop: "-4px",
    },
    textContainer: {
        width: "100%",
    }
}))

interface InviteToTeamNotificationProps {
    invite: InviteToTeam,
    timeAgoText: string,
    startDivider?: boolean,
    endDivider?: boolean,
}

export const InviteToTeamNotification = (props: InviteToTeamNotificationProps): JSX.Element => {
    const classes = useStyles();
    const {acceptInvitation, declineInvitation} = useInviteToTeamMutation();

    const acceptInvite = (invite: InviteToTeam, e?: React.MouseEvent<HTMLElement>) => {
        e?.preventDefault();
        e?.stopPropagation()
        acceptInvitation(invite.id ?? -1)
    }


    const declineInvite = (invite: InviteToTeam, e?: React.MouseEvent<HTMLElement>) => {
        e?.preventDefault();
        e?.stopPropagation()
        declineInvitation(invite.id ?? -1)
    }

    return <>
        {props.startDivider && <Divider/>}
        <MenuItem className={classes.container}>
            <Link to={"/teams/" + props.invite.team.id}>
                <img className={classes.teamPicture}
                     src={getPictureLinkFromKey(props.invite.team.picture, ObjectType.Team)}/>
            </Link>
            <Typography component={"div"} className={classes.textContainer}>
                <Link to={"/players/" + props.invite.sender.id}>
                    <Box fontWeight={"fontWeightMedium"} display={"inline"}>
                        {props.invite.sender.playertag}
                    </Box>
                </Link>
                {" har inviteret dig til "}
                <Link to={"/teams/" + props.invite.team.id}>
                    <Box fontWeight={"fontWeightMedium"} display={"inline"} whiteSpace={"pre-wrap"}>
                        {props.invite.team.name}
                    </Box>
                </Link>
                <div className={classes.secondaryInformation}>
                    <Box fontStyle={"oblique"}>
                        {props.timeAgoText}
                    </Box>
                    {props.invite.status === InvitationStatus.Pending ?
                        <div className={classes.actionContainer}>
                            <Icon className={classes.accept} onClick={(e) => acceptInvite(props.invite, e)}>
                                <Check/>
                            </Icon>
                            <Icon className={classes.decline} onClick={(e) => declineInvite(props.invite, e)}>
                                <Clear/>
                            </Icon>
                        </div> :
                        <Box fontStyle={"oblique"} display={"inline"}>
                            {props.invite.status === InvitationStatus.Accepted ? "Accepteret" : "Afvist"}
                        </Box>
                    }
                </div>
            </Typography>
        </MenuItem>
        {props.endDivider && <Divider/>}
    </>
}