import {Theme} from "@mui/material";
import {makeStyles} from "@mui/styles"

interface StylesProps {
    halfGrow?: boolean
    padding?: boolean
    hasConnector?: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    spacer: props => ({
        flexGrow: props.halfGrow ? 0.5 : 1,
        "&::after": {
            content: '""',
            height: "calc(100% + 4px)",
            position: "relative",
            display: "block",
            left: "50px",
            marginTop: "-2px",
            borderRight: !props.hasConnector ? "none" : "1px solid black",
            padding: props.padding ? "4px 0px" : "0px",
        }
    })
}))

interface TournamentBracketMatchSpacerProps {
    halfGrow?: boolean
    padding?: boolean
    hasConnector?: boolean
}

export const TournamentBracketMatchSpacer = (props: TournamentBracketMatchSpacerProps): JSX.Element => {
    const classes = useStyles(props)
    return <div className={classes.spacer}/>
}