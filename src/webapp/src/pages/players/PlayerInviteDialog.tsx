import * as React from "react";
import {useCallback, useMemo, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider as MuiDivider,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {CenteredPage} from "../../components/CenteredPage";
import {InviteToTeamStatus, ObjectType, User} from "../../codegen/generated-types";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {useFindAllInvitesForPlayer, useInviteToTeamMutation} from "../../hooks/api/useInviteToTeam";
import {Close, Search} from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
    inviteDialog: {
        marginTop: theme.spacing(2),
        paddingRight: theme.spacing(2),
        height: "400px",
        width: "600px",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
            width: "4px"
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1c95f3",
        },
    },
    teamContainer: {
        marginTop: theme.spacing(1),
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
    open: boolean
    setOpen: (open: boolean) => void,
    targetPlayer: User
}

export const PlayerInviteDialog = (props: PlayerInviteDialogProps): JSX.Element => {
    const classes = useStyles();
    const {currentUser} = useGetCurrentUser();
    const {createInviteToTeam} = useInviteToTeamMutation()
    const {allInvitesForPlayer} = useFindAllInvitesForPlayer(props.targetPlayer.id ?? -1)
    const [searchText, setSearchText] = useState<string>("")

    const shouldDisableInviteButton = useCallback((teamId: number | null | undefined) => {
        const playerInvitesByTeam = allInvitesForPlayer?.filter(invite => invite.team.id === teamId);
        const playerHasPendingInvite = playerInvitesByTeam?.find(invite => invite.status === InviteToTeamStatus.Pending)
        const playerIsAlreadyOnTeam = props.targetPlayer.teams.find(team => team.id === teamId);

        return !!(playerHasPendingInvite || playerIsAlreadyOnTeam)
    }, [allInvitesForPlayer, props.targetPlayer.teams])

    const filteredTeams = useMemo(() => {
        return currentUser?.teams.slice().filter(team => team.name.toLowerCase().includes(searchText.toLowerCase().trim()))
    }, [currentUser?.teams, searchText])

    const teamsSorted = useMemo(() => {
        return filteredTeams?.slice().sort((team1, team2) => team1.name.toLowerCase().trim() < team2.name.toLowerCase().trim() ? -1 : 1 )
    }, [filteredTeams])

    if (!currentUser) {
        return <CenteredPage/>;
    }

    const handleInvite = (teamId: number | null | undefined) => {
        if (props.targetPlayer.id && teamId && currentUser.id) {
            createInviteToTeam(props.targetPlayer.id, teamId, currentUser.id)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    return <Dialog open={props.open}
                   onClose={() => props.setOpen(false)}
                   maxWidth={"xl"}>

        <DialogTitle>
            <Typography variant={"subtitle1"}>{`Inviter ${props.targetPlayer.playertag} til hold`}</Typography>
        </DialogTitle>
        <IconButton
            onClick={() => props.setOpen(false)}
            sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
            }}
        >
            <Close/>
        </IconButton>
        <DialogContent>
            <TextField style={{width: "100%"}}
                       InputProps={{startAdornment: <InputAdornment position={"start"}><Search/></InputAdornment>}}
                       placeholder={"Søg efter hold..."}
                       onChange={handleSearch}
            />
            <Box className={classes.inviteDialog}>
                {teamsSorted.map((team, index) => {
                    return <React.Fragment>
                        <div className={classes.teamContainer}>
                            <div className={classes.teamInfo}>
                                <img src={getPictureLinkFromKey(team.picture ?? null, ObjectType.Team) ?? "asd"}
                                     className={classes.teamImage} aria-label={"Team picture"}/>
                                <Typography variant={"subtitle2"} className={classes.teamName}>{team.name}</Typography>
                            </div>
                            <Button variant={"outlined"} color={"primary"} style={{height: "32px"}}
                                    disabled={shouldDisableInviteButton(team.id)}
                                    onClick={() => handleInvite(team?.id)}>Inviter</Button>
                        </div>
                        {currentUser.teams?.length != index + 1 ? <MuiDivider className={classes.MuiDivider}/> : <></>}
                    </React.Fragment>
                })}
            </Box>
        </DialogContent>
    </Dialog>
}