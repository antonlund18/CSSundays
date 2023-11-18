import * as React from "react"
import {makeStyles} from "@mui/styles";
import {TableCell, TableRow, Theme, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ObjectType, Team} from "../../../codegen/generated-types";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {PlayerBox} from "../../tournamentpage/tabs/PlayerBox";

const IMAGE_SIZE = "64px"

type StylesProps = {
    pictureUrl: string
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    picture: props => ({
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,
        backgroundImage: "url(" + props.pictureUrl + ")",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "50%, 50%",
        backgroundColor: "white",
        border: "2px solid white",
        marginRight: theme.spacing(2)
    })
}))

type PlayerTeamsTabTeamRowProps = {
    team: Team,
}

export const PlayerTeamsTabTeamRow = (props: PlayerTeamsTabTeamRowProps): JSX.Element => {
    const pictureUrl = getPictureLinkFromKey(props.team.picture ?? "", ObjectType.Team)
    const classes = useStyles({pictureUrl: pictureUrl})
    const navigate = useNavigate()

    return <TableRow>
        <TableCell style={{cursor: "pointer"}} onClick={() => navigate("/teams/" + props.team.id)}>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                <div className={classes.picture}/>
                <Typography variant={"h4"}>{props.team.name}</Typography>
            </div>
        </TableCell>
        <TableCell>
            <div style={{display: "flex", flexDirection: "row"}}>
                {props.team.users.slice(0, 5).map(player => {
                    return <PlayerBox player={player}/>
                })}
            </div>
        </TableCell>
    </TableRow>
}