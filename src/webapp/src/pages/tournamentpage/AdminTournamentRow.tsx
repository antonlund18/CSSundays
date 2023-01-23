import {IconButton, TableCell, TableRow, Typography} from "@material-ui/core";
import * as React from "react";
import {Tournament} from "../../codegen/generated-types";
import {formatDate} from "../../helpers/helpers";
import {Edit} from "@material-ui/icons";

interface AdminTournamentRowProps {
    tournament: Tournament
}

export const AdminTournamentRow = (props: AdminTournamentRowProps): JSX.Element => {
    const date = formatDate(new Date(props.tournament.createdTs))

    return <TableRow style={{color: "#123123"}}>
        <TableCell>
            <Typography color={"inherit"}>
                {`${props.tournament.name} (${props.tournament.registeredTeams.length} / ${props.tournament.numberOfTeamsAllowed})`}
            </Typography>
        </TableCell>
        <TableCell>
            <Typography color={"inherit"}>
                {props.tournament.published ? "Ja" : "Nej"}
            </Typography>
        </TableCell>
        <TableCell align={"right"}>
            <Typography color={"inherit"}>
                {props.tournament.date}
            </Typography>
        </TableCell>
        <TableCell align={"right"}>
            <Typography color={"inherit"}>
                {date}
            </Typography>
        </TableCell>
        <TableCell>
            <IconButton onClick={() => window.open("/tournaments/" + props.tournament.id, "_blank")}>
                <Edit/>
            </IconButton>
        </TableCell>
    </TableRow>
}