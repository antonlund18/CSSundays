import {ObjectType, Tournament} from "../../../codegen/generated-types";
import {Divider, Grid, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import * as React from "react";
import {useMemo} from "react";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {Theme} from "@mui/material/styles";
import MarkdownView from "react-showdown";
import {useDateFormatter} from "../../../hooks/useDateFormatter";

interface StylesProps {
    tournamentPictureURL: string
}

const formatTextMap = {
    SINGLE_ELIMINATION: {
        text: "Single Elimination"
    }
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    container: {
        minHeight: "200px",
    },
    text: {
        marginTop: theme.spacing(4)
    },
    tournamentPicture: props => ({
        content: "''",
        width: "100%",
        height: "300px",
        backgroundImage: "url(" + props.tournamentPictureURL + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%, 50%"
    }),
    descriptionText: {
        "& p": {
            margin: 0,
            padding: 0
        }
    }
}))

interface InformationTabContentProps {
    tournament: Tournament
}

export const InformationTabContent = (props: InformationTabContentProps): JSX.Element => {
    const tournamentPictureURL = getPictureLinkFromKey(props.tournament.picture ?? "", ObjectType.Tournament)
    const classes = useStyles({tournamentPictureURL: tournamentPictureURL})
    const {formatDateTime} = useDateFormatter()

    const registeredTeams = useMemo(() => {
        return props.tournament.teamRegistrations.length
    }, [props.tournament])

    return <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12}>
            <div className={classes.tournamentPicture}/>
        </Grid>
        <Grid item xs={7}>
            <MarkdownView markdown={props.tournament.description} className={classes.descriptionText}/>
        </Grid>
        <Divider orientation={"vertical"} variant={"fullWidth"} flexItem style={{margin: 16}}/>
        <Grid item xs={4} className={classes.contentLeft}>
            <Typography variant={"h4"}>Format</Typography>
            <Typography>{formatTextMap[props.tournament.format].text}</Typography>
            <Typography variant={"h4"} className={classes.text}>Starttidspunkt</Typography>
            <Typography>{formatDateTime(props.tournament.startDateAndTime)}</Typography>
            <Typography variant={"h4"} className={classes.text}>Tilmeldte hold</Typography>
            <Typography>{`${registeredTeams}/${props.tournament.numberOfTeamsAllowed}`}</Typography>
        </Grid>
    </Grid>
}