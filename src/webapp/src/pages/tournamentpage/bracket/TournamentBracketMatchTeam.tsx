import * as React from "react"
import {ObjectType, Team} from "../../../codegen/generated-types";
import {ListItemIcon, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
    imageContainer: {
        minWidth: 0
    },
    image: {
        marginRight: "4px",
        padding: "4px",
        height: "20px",
        width: "20px"
    }
}))

type TournamentBracketMatchTeamProps = {
    team: Team
    isCurrentUserOnTeam: boolean
}

export const TournamentBracketMatchTeam = (props: TournamentBracketMatchTeamProps) => {
    const classes = useStyles(props)

    return <>
        <ListItemIcon className={classes.imageContainer}>
            <img src={getPictureLinkFromKey(props.team.picture ?? null, ObjectType.Team)} className={classes.image}/>
        </ListItemIcon>
        {props.isCurrentUserOnTeam ?
            <Typography noWrap color={"primary"} fontWeight={"bold"} style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                {props.team.name}
            </Typography> :
            <Typography noWrap style={{textOverflow: "ellipsis", fontSize: "12px"}}>
                {props.team.name}
            </Typography>
        }
    </>
}