import * as React from "react"
import {ObjectType, Team} from "../../codegen/generated-types";
import {Box, Theme} from "@mui/material";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles"

type StylesProps = {
    playerPictureURL: string
    playerName: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    playerContainer: {
        flexGrow: 5, width: "100%",
        cursor: "pointer",
        textAlign: "center",
        justifyContent: "center",
    },
    playerPicture: props => ({
        "&::after": {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "rgba(0, 0, 0, .4)",
            color: "rgb(241,241,241)",
            content: "'" + props.playerName + "'"
        },
        aspectRatio: "1/1",
        margin: theme.spacing(1),
        border: "2px solid white",
        position: "relative",
        backgroundImage: "url(" + props.playerPictureURL + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
    }),
}))

export type TeamPictureProps = {
    team: Team
}

export const ProfileTabSocialTeamPicture = (props: TeamPictureProps): JSX. Element => {
    const {team} = props
    const playerPictureURL = getPictureLinkFromKey(team.picture ?? null, ObjectType.Team)
    const playerName = team.name ? team.name : ""
    const classes = useStyles({playerPictureURL: playerPictureURL, playerName: playerName});
    const navigate = useNavigate();

    if (!team.id) {
        return <></>
    }

    return <div key={team.name} className={classes.playerContainer}
                onClick={() => navigate("/teams/" + team.id)}>
        <Box boxShadow={1} className={classes.playerPicture}/>
    </div>
}