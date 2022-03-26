import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Button, Grid, makeStyles, Theme, Typography} from "@material-ui/core";
import {CenteredPage} from "../../components/CenteredPage";
import {useParams} from "react-router-dom";
import {usePlayersCollection} from "../../firebase/database/database";
import {Player} from "../../firebase/database/PlayersHandler";
import {Divider as CSDivider} from "../../components/Divider";
import {useAuth} from "../../firebase/authentication/AuthContext";
import {theme} from "../../theme/theme";
import {PlayerInviteDialog} from "./PlayerInviteDialog";

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
    const playersDatabase = usePlayersCollection();
    const {currentUser} = useAuth();

    const [player, setPlayer] = useState<Player | null>(null);
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const isCurrentUser = currentUser && player?.email === currentUser?.email;
    const classes = useStyles({isCurrentUser: !!isCurrentUser});
    const [isInviteDialogOpen, setInviteDialogOpen] = useState<boolean>(false);

    const buildFileSelector = () => {
        const selector = document.createElement("input");
        selector.setAttribute("type", "file");
        selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
        selector.addEventListener("change", async () => {
            playersDatabase.uploadImage(currentUser?.uid ?? "", selector).then(() => {
                updatePlayer();
            })
        });
        setFileSelector(selector);
    }

    const updatePlayer = () => {
        playersDatabase.getPlayerByUsername(urlParams.player ?? "")
            .then(data => {
                if (data) {
                    setPlayer(data)
                }
            })
            .catch((error) => {
                return;
            })
    }

    useEffect(() => {
        updatePlayer();
        if (isCurrentUser) {
            buildFileSelector();
        }
    }, [isCurrentUser])

    const handleFileSelect = () => {
        fileSelector?.click();
    }

    if (!player) {
        return <CenteredPage/>
    }

    return <CenteredPage>
        <div className={classes.pageTitleContainer}>
            <Typography variant={"h2"} color={"primary"} style={{textTransform: "none"}}>{player?.username}</Typography>
            {isCurrentUser ?
                <Button color={"primary"} variant={"outlined"} style={{marginBottom: -theme.spacing(1)}}>
                    Rediger
                </Button> :
                <Button color={"primary"} variant={"outlined"} style={{marginBottom: -theme.spacing(1)}} onClick={() => setInviteDialogOpen(true)}>
                    Inviter
                </Button>}
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
                    <img src={player?.picture} width={"100%"} height={"100%"}/>
                </Box>
            </Grid>
            <Grid item xs={12} md={8}>
                <div className={classes.playerInfoContainer}>
                    <Typography/>
                </div>
            </Grid>
        </Grid>
        {isInviteDialogOpen &&
            <PlayerInviteDialog setDialogOpen={setInviteDialogOpen} player={player}/>}
    </CenteredPage>
}