import * as React from "react"
import {Divider, Grid, Typography} from "@mui/material";
import {User} from "../../codegen/generated-types";
import {useDateFormatter} from "../../hooks/useDateFormatter";
import {makeStyles} from "@mui/styles";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    container: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "#a9a9a9",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        marginRight: "16px",
    },
    seeAll: {
        padding: theme.spacing(1),
        background: "rgba(0, 0, 0, .4)",
        color: "rgb(241,241,241)",
        cursor: "pointer",
    }
}))

type ProfileTabInformationSectionProps = {
    player: User
}

export const ProfileTabInformationSection = (props: ProfileTabInformationSectionProps): JSX.Element => {
    const {formatDate} = useDateFormatter()
    const classes = useStyles()
    const navigate = useNavigate()

    return <Grid item xs={4}>
        <Typography variant={"h4"}>Achievements</Typography>
        <div className={classes.container}>
            <div style={{display: "flex", height: "80px", justifyContent: "center", alignItems: "center"}} >
                <Typography variant={"h4"}>Kommer snart 🔨</Typography>
            </div>
            <Typography variant={"h4"} className={classes.seeAll} onClick={() => navigate("")}>se alle</Typography>
        </div>
    </Grid>
}