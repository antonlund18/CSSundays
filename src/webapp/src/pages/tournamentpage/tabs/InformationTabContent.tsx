import {Tournament} from "../../../codegen/generated-types";
import {Box, Grid, List, ListItem, makeStyles, Typography} from "@material-ui/core";
import {useMemo} from "react";

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: "white",
        minHeight: "200px",
        padding: theme.spacing(2),
    },
    contentLeft: {
        marginLeft: theme.spacing(8),
    },
    text: {
        marginTop: theme.spacing(4)
    }
}))

interface InformationTabContentProps {
    tournament: Tournament
}

export const InformationTabContent = (props: InformationTabContentProps): JSX.Element => {
    const classes = useStyles()

    const registeredTeams = useMemo(() => {
        return props.tournament.teamRegistrations.length
    }, [props.tournament])

    return <Grid container className={classes.container}>
        <Grid item xs={7}>
            <Typography variant={"h4"}>Beskrivelse</Typography>
            <Typography>
                Velkommen til CSSundays' månedlige turnering #1.
            </Typography>
            <Typography>
                Tilmeld dig Danmarks fedeste Counter-Strike turnering og vind lækre pengepræmier.
            </Typography>
            <br/>
            <Typography style={{whiteSpace: "pre-wrap"}}>
                Hvis du ikke kan få samlet dine venner, kan du også følge med fra sofaen,
                hvor Støy & Væver fra Ace Podcast, vil sørge for at levere underholdning i verdensklasse.
                Se med <a href={"//www.twitch.tv/cssundays"} target={"_blank"}>her</a>!
            </Typography>

            <Typography variant={"h4"} className={classes.text}>Sådan tilmelder du dig</Typography>
            <Typography>Det her aldrig været nemmere at komme i gang.</Typography>
            <ol>
                <li><Typography>Opret en bruger</Typography></li>
                <li><Typography>Opret et hold</Typography></li>
                <li><Typography>Invitér dine venner til dit hold</Typography></li>
                <li><Typography>Tryk på "Tilmeld hold" ovenover</Typography></li>
            </ol>
            <Typography>Og det var det! Du er nu tilmeldt 🎉</Typography>
        </Grid>
        <Grid item xs={4} className={classes.contentLeft}>
            <Typography variant={"h4"}>Præmiepulje</Typography>
            <Typography>1.000 DKK</Typography>
            <Typography variant={"h4"} className={classes.text}>Format</Typography>
            <Typography>Single Elimination BO1</Typography>
            <Typography variant={"h4"} className={classes.text}>Starttidspunkt</Typography>
            <Typography>14:00</Typography>
            <Typography variant={"h4"} className={classes.text}>Tilmeldte hold</Typography>
            <Typography>{`${registeredTeams}/${props.tournament.numberOfTeamsAllowed}`}</Typography>
        </Grid>
    </Grid>
}