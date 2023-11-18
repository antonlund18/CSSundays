import * as React from "react"
import {User} from "../../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useParams} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    emptyFriendsContainer: {
        height: "75vh",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}))

type PlayerFriendsTabContentProps = {
    player: User
    isCurrentUser: boolean
}

export const PlayerFriendsTabContent = (props: PlayerFriendsTabContentProps): JSX.Element => {
    const classes = useStyles();

    return <Grid item xs={12} className={classes.emptyFriendsContainer}>
        <Typography variant={"h2"}>Under udvikling 🔨</Typography>
    </Grid>
}
