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

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    container: {
        minHeight: "200px",
    },
    tournamentPicture: props => ({
        content: "''",
        width: "100%",
        height: "300px",
        backgroundImage: "url(" + props.tournamentPictureURL + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%, 50%"
    }),
}))

interface RulesTabProps {
    tournament: Tournament
}

export const RulesTab = (props: RulesTabProps): JSX.Element => {
    const tournamentPictureURL = getPictureLinkFromKey(props.tournament.picture ?? "", ObjectType.Tournament)
    const classes = useStyles({tournamentPictureURL: tournamentPictureURL})

    return <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12}>
            <div className={classes.tournamentPicture}/>
        </Grid>
        <Grid item xs={7}>
            <MarkdownView markdown={props.tournament.rules}/>
        </Grid>
    </Grid>
}