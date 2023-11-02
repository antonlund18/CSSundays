import * as React from "react"
import {useEffect, useState} from "react"
import {Divider, Grid, Theme, Tooltip, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {ObjectType, Team, User} from "../../../codegen/generated-types";
import {useSharedTeamAndUser} from "../../../hooks/api/useSharedTeamAndUser";
import {useDateFormatter} from "../../../hooks/useDateFormatter";
import {useNavigate} from "react-router-dom";

interface StylesProps {
    isCurrentUserOwner: boolean
    teamPictureURL: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    teamPicture: props => ({
        aspectRatio: "1/1",
        border: "2px solid white",
        cursor: props.isCurrentUserOwner ? "pointer" : "default",
        backgroundImage: "url(" + props.teamPictureURL + " )",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50% 50%",
        backgroundColor: "#525252"
    }),
    teamInfoContainer: {
        display: "flex",
        justifyContent: "space-between"
    }
}))

export type TeamInfoProps = {
    team: Team
    currentUser: User
}

export const TeamInfo = (props: TeamInfoProps): JSX.Element => {
    const {team, currentUser} = props
    const teamPictureURL = getPictureLinkFromKey(team?.picture ?? "", ObjectType.Team)
    const isCurrenUserOwner = currentUser?.id === team?.owner?.id;
    const classes = useStyles({isCurrentUserOwner: isCurrenUserOwner, teamPictureURL: teamPictureURL});
    const [fileSelector, setFileSelector] = useState<HTMLInputElement | null>(null);
    const {formatDate} = useDateFormatter()
    const navigate = useNavigate()

    useEffect(() => {
        if (team) {
            const selector = document.createElement("input");
            selector.setAttribute("type", "file");
            selector.setAttribute("accept", "image/jpeg, image/png, image/jpg");
            selector.addEventListener("change", async () => {
                if (team.id) {
                    await setAndUploadPicture(team.id, selector, ObjectType.Team)
                }
            })
            setFileSelector(selector);
        }
    }, [team])

    const {setAndUploadPicture} = useSharedTeamAndUser();

    const handleFileSelect = () => {
        if (team?.owner?.id === currentUser?.id) {
            fileSelector?.click();
        }
    }

    return <Grid container spacing={2} style={{width: "100%"}}>
        <Grid item style={{width: "100%"}}>
            <Tooltip title={"Upload billede"} disableHoverListener={!isCurrenUserOwner} arrow>
                <div className={classes.teamPicture} onClick={handleFileSelect}/>
            </Tooltip>
        </Grid>
        <Grid item style={{width: "100%"}}>
            <div className={classes.teamInfoContainer}>
                <Typography variant={"h4"}>Owner:</Typography>
                <Typography variant={"h4"} style={{cursor: "pointer"}} onClick={() => navigate("/players/" + team?.owner?.id ?? "")}>{team?.owner?.playertag}</Typography>
            </div>
            <Divider style={{margin: "8px 0px"}}/>
            <div className={classes.teamInfoContainer}>
                <Typography variant={"h4"}>Dato oprettet:</Typography>
                <Typography variant={"h4"}>{formatDate(team?.createdTs)}</Typography>
            </div>
            <Divider style={{margin: "8px 0px"}}/>
            <div className={classes.teamInfoContainer}>
                <Typography variant={"h4"}>Antal spillere:</Typography>
                <Typography variant={"h4"}>{team?.users?.length}</Typography>
            </div>
        </Grid>
    </Grid>
}