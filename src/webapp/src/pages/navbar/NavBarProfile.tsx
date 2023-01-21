import * as React from "react";
import {useState} from "react";
import {Box, Button, makeStyles, Typography} from "@material-ui/core";
import {LoginDialog} from "../../login/LoginDialog";
import {PlayerDropdown} from "./PlayerDropdown";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {ObjectType} from "../../codegen/generated-types";
import {NotificationsButton} from "./notifications/NotificationsButton";
import {NavBarMenuItem} from "./NavBarMenuItem";

const useStyles = makeStyles((theme) => ({
    profileSectionContainer: {
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    image: {
        marginTop: theme.spacing(1),
        display: "block",
        height: "40px",
        width: "40px",
        padding: "4px",
        borderRadius: "50%",
        backgroundColor: "#f5f9fc",
    },
    playerContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        padding: "0 24px",
        textAlign: "center",
    },
    loggedInContainer: {
        display: "flex",
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
            <div className={classes.loggedInContainer}>
                <NotificationsButton/>
                <NavBarMenuItem onClick={(e) => handleOpenPlayerDropdown(e)}>
                    <div className={classes.playerContainer}>
                        <img className={classes.image}
                             src={getPictureLinkFromKey(currentUser.picture ?? null, ObjectType.User)}/>
                    </div>
                </NavBarMenuItem>
                <PlayerDropdown closeDropdown={handleClosePlayerDropdown} anchorEl={anchorEl} player={currentUser}/>
            </div>
            :
            <Button onClick={() => handleOpenLoginDialog(true)}>
                <Typography variant={"button"}>Log ind</Typography>
            </Button>
        }
        {loginDialogIsOpen &&
            <LoginDialog setOpen={handleOpenLoginDialog}/>}
    </div>
}