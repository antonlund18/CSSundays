import * as React from "react"
import {Grid, Typography} from "@mui/material";
import {User} from "../../../codegen/generated-types";
import {makeStyles} from "@mui/styles";
import {useNavigate} from "react-router-dom";
import {ProfileTabSocialTeamPicture} from "./ProfileTabSocialTeamPicture";

const useStyles = makeStyles(theme => ({
    container: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        marginTop: "8px",
    },
    seeAll: {
        padding: theme.spacing(1),
        background: "rgba(0, 0, 0, .4)",
        color: "rgb(241,241,241)",
        cursor: "pointer",
    }
}))

type ProfileTabSocialSectionProps = {
    player: User
}

export const ProfileTabSocialSection = (props: ProfileTabSocialSectionProps): JSX.Element => {
    const classes = useStyles();
    const navigate = useNavigate()

    const teams = props.player.teams.filter(team => team.deletedTs === null)

    return <Grid item xs={12} sx={{}}>
        <Typography variant={"h4"}>{"Hold (" + teams.length + ")"}</Typography>
        <div className={classes.container}>
            <div style={{display: "flex", minHeight: "120px"}}>
                {teams.slice(0, 5).map(team => {
                    return <ProfileTabSocialTeamPicture team={team}/>
                })}
            </div>
            <Typography variant={"h4"} className={classes.seeAll} onClick={() => navigate("#teams")}>se alle hold</Typography>
        </div>
        <Typography variant={"h4"} sx={{marginTop: "32px"}}>Venner</Typography>
        <div className={classes.container}>
            <div style={{display: "flex", height: "120px", justifyContent: "center", alignItems: "center"}} >
                <Typography variant={"h4"}>Kommer snart 🔨</Typography>
            </div>
            <Typography variant={"h4"} className={classes.seeAll} onClick={() => navigate("")}>se alle venner</Typography>
        </div>
    </Grid>
}