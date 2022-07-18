import * as React from "react";
import {useEffect, useState} from "react";
import {Button, makeStyles, Typography} from "@material-ui/core";
import {LoginDialog} from "../../login/LoginDialog";
import {useAuth} from "../../firebase/authentication/AuthContext";
import {PlayerDropdown} from "./PlayerDropdown";
import {usePlayersCollection} from "../../firebase/database/database";
import {Player} from "../../firebase/database/PlayersHandler";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {getPictureLinkFromKey} from "../../util/StorageHelper";

const useStyles = makeStyles((theme) => ({
    profileSectionContainer: {
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    image: {
        border: "1px solid black",
        display: "block",
        margin: "auto",
        borderRadius: "50%",
        height: "32px",
        width: "32px",
    },
    loggedInContainer: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center"
    },
    playerName: {
        marginRight: theme.spacing(1),
        textTransform: "none",
        lineHeight: "32px",
    }
}));

export const NavBarProfile = (): JSX.Element => {
    const classes = useStyles();
    const {currentUser} = useGetCurrentUser();

    const [loginDialogIsOpen, setLoginDialogIsOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpenLoginDialog = (open: boolean) => {
        setLoginDialogIsOpen(open);
    }

    const handleOpenPlayerDropdown = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClosePlayerDropdown = () => {
        setAnchorEl(null);
    }

    return <div className={classes.profileSectionContainer}>
        {currentUser ?
            <>
                <div className={classes.loggedInContainer} onClick={(e) => handleOpenPlayerDropdown(e)}>
                    <Typography variant={"subtitle2"}
                                className={classes.playerName}>{currentUser?.playertag}</Typography>
                    <img className={classes.image} src={currentUser.picture && getPictureLinkFromKey(currentUser.picture)}/>
                </div>
                <PlayerDropdown closeDropdown={handleClosePlayerDropdown} anchorEl={anchorEl} player={currentUser}/>
            </>
            :
            <Button onClick={() => handleOpenLoginDialog(true)}>
                <Typography variant={"button"}>Log ind</Typography>
            </Button>
        }
        {loginDialogIsOpen &&
            <LoginDialog setOpen={handleOpenLoginDialog}/>}
    </div>
}