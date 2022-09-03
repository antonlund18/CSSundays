import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Button, Grid, makeStyles, Theme, Tooltip, Typography} from "@material-ui/core";
import {CenteredPage} from "../../components/CenteredPage";
import {useParams} from "react-router-dom";
import {Divider as CSDivider} from "../../components/Divider";
import {PlayerInviteDialog} from "./PlayerInviteDialog";
import {useGetCurrentUser, useGetUserById} from "../../hooks/api/useUser";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {useSharedTeamAndUser} from "../../hooks/api/useSharedTeamAndUser";
import {ObjectType} from "../../codegen/generated-types";

interface StylesProps {
    isCurrentUser: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    pageTitleContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    playerInfoContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    playerPicture: props => ({
        height: "346px",
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        cursor: props.isCurrentUser ? "pointer" : "default",
    })
}));

export const PlayerPage = (): JSX.Element => {
    const urlParams = useParams();
    const {setAndUploadPicture} = useSharedTeamAndUser();

    const {user} = useGetUserById(parseInt(urlParams.player ?? ""))
    const {currentUser, isLoggedIn} = useGetCurrentUser();
    const isCurrentUser = user?.id === currentUser?.id;

    const classes = useStyles({isCurrentUser: isCurrentUser});

    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const [isInviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);


    useEffect(() => {
        if (user) {
            const selector = document.createElement("input");
            selector.setAttribute("type", "file");
            selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            selector.addEventListener("change", async () => {
                if (user.id) {
                    await setAndUploadPicture(user.id, selector, ObjectType.User)
                }
            })
            setFileSelector(selector);
        }
    }, [user])

    if (!user) {
        return <></>
    }

    const handleFileSelect = () => {
        if (isCurrentUser) {
            fileSelector?.click();
        }
    }

    if (!user) {
        return <CenteredPage/>
    }

    return <CenteredPage>
        <div className={classes.pageTitleContainer}>
            <Typography variant={"h2"} color={"primary"} style={{textTransform: "none"}}>{user.playertag}</Typography>
            {isCurrentUser ?
                <Button color={"primary"} variant={"contained"}>
                    Rediger
                </Button> :
                <Button color={"primary"} variant={"contained"}
                        onClick={() => setInviteDialogOpen(true)}>
                    Inviter
                </Button>
            }
        </div>
        <CSDivider/>
        <Grid container
              direction={"row"}
              justifyContent={"center"}
              alignItems={"stretch"}
              spacing={3}
        >
            <Grid item xs={12} md={4}>
                <Box boxShadow={3} className={classes.playerPicture} onClick={handleFileSelect}>
                    <Tooltip title={"Upload billede"} disableHoverListener={!isCurrentUser} arrow>
                        <img src={getPictureLinkFromKey(user.picture ?? null, ObjectType.User)} width={"100%"} height={"100%"}/>
                    </Tooltip>
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                <div className={classes.playerInfoContainer}>
                    <Typography/>
                </div>
            </Grid>
        </Grid>
        {isInviteDialogOpen &&
            <PlayerInviteDialog setDialogOpen={setInviteDialogOpen} targetPlayer={user}/>}
    </CenteredPage>
}