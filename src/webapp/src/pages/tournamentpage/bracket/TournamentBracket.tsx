import {Bracket} from "../../../codegen/generated-types";
import {Box} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {TournamentBracketRound} from "./TournamentBracketRound";
import {ConnectorAfter} from "./TournamentBracketMatch";
import {useContext} from "react";
import {BracketContext} from "../tabs/BracketContextProvider";

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        padding: theme.spacing(2)
    }
}))

interface TournamentBracketProps {
    bracket: Bracket | null | undefined
    setIsLoading: (loading: boolean) => void
}

export const TournamentBracket = (props: TournamentBracketProps): JSX.Element => {
    const classes = useStyles();
    const {numberOfRoundsToBeShown} = useContext(BracketContext)

    if (!props.bracket?.root) {
        return <></>
    }

    return <Box className={classes.container}>
        <TournamentBracketRound matches={[props.bracket.root]} connectorAfter={ConnectorAfter.NONE}
                                setIsLoading={props.setIsLoading}
                                numberOfRoundsToBeShown={numberOfRoundsToBeShown}
                                currentNumberOfRoundsShown={1}
        />
    </Box>
}