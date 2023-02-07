import {Bracket} from "../../codegen/generated-types";
import {Box, makeStyles} from "@material-ui/core";
import {TournamentBracketRound} from "./TournamentBracketRound";
import {CenteredPage} from "../../components/CenteredPage";
import {ConnectorAfter} from "./TournamentBracketMatch";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "right",
    }
})

interface TournamentBracketProps {
    bracket: Bracket | null | undefined
}

export const TournamentBracket = (props: TournamentBracketProps): JSX.Element => {
    const classes = useStyles();

    if (!props.bracket?.root) {
        return <CenteredPage/>
    }

    return <Box className={classes.container}>
        <TournamentBracketRound matches={[props.bracket.root]} connectorAfter={ConnectorAfter.NONE}/>
    </Box>
}