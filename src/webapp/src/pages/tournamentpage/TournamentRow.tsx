import * as React from "react"
import {Grid, Typography} from "@mui/material";
import {ObjectType, Tournament, TournamentStatus} from "../../codegen/generated-types";
import {useDateFormatter} from "../../hooks/useDateFormatter";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {ArrowForwardIosRounded} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

type StylesProps = {
    tournamentPictureUrl: string
}


const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    tournamentPicture: props => ({
        height: "200px",
        width: "400px",
        backgroundImage: "url(" + props.tournamentPictureUrl + ")",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%, 50%",
        marginRight: theme.spacing(2)
    }),
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer"
    }
}))

type TournamentRowProps = {
    tournament: Tournament
}

export const TournamentRow = (props: TournamentRowProps): JSX.Element => {
    const {formatTime} = useDateFormatter()
    const tournamentPictureUrl = getPictureLinkFromKey(props.tournament.picture ?? "", ObjectType.Tournament)
    const classes = useStyles({tournamentPictureUrl: tournamentPictureUrl})
    const navigate = useNavigate()

    const getStatusText = (tournamentStatus: TournamentStatus) => {
        switch (tournamentStatus) {
            case TournamentStatus.OpenForRegistrations:
                return "Åben for tilmeldinger"
            case TournamentStatus.ClosedForRegistrations:
                return "Lukket for tilmeldinger"
            case TournamentStatus.InProgress:
                return "I gang"
            case TournamentStatus.Finished:
                return "Afsluttet"
            default:
                return "Ukendt"
        }
    }

    const startDateAndTime = new Date(props.tournament.startDateAndTime).toLocaleDateString("da", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        + " kl. " + formatTime(props.tournament.startDateAndTime)

    const numberOfRegisteredTeams = props.tournament.tournamentRegistrations.length

    return <Grid item xs={12} className={classes.container} onClick={() => navigate(props.tournament.id?.toString() ?? "")}>
        <div style={{display: "flex", alignItems: "center"}}>
            <div className={classes.tournamentPicture}/>
            <div>
                <Typography variant={"subtitle2"} color={"primary"}>{startDateAndTime}</Typography>
                <Typography variant={"h2"}>{props.tournament.name}</Typography>
                <Typography variant={"h4"}>{getStatusText(props.tournament.status)}</Typography>
            </div>
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
            <div style={{textAlign: "center"}}>
                <Typography variant={"h2"}>{numberOfRegisteredTeams + " / " + props.tournament.numberOfTeamsAllowed}</Typography>
                <Typography variant={"subtitle2"}>Tilmeldte hold</Typography>
            </div>
            <ArrowForwardIosRounded style={{marginLeft: "16px", marginRight: "16px"}}/>
        </div>
    </Grid>
}