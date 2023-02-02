import {IconButton, TableCell, TableRow, Typography} from "@material-ui/core";
import * as React from "react";
import {Tournament} from "../../codegen/generated-types";
import {formatDate} from "../../helpers/helpers";
import {Dock, Edit} from "@material-ui/icons";
import {useTournaments} from "../../hooks/api/useTournament";

interface AdminTournamentRowProps {
    tournament: Tournament
}

export const AdminTournamentRow = (props: AdminTournamentRowProps): JSX.Element => {
    const date = formatDate(new Date(props.tournament.createdTs))
    const {registerTeam, generateBracket} = useTournaments()

    const createDummyTeam = () => {
        if (props.tournament.id) {
            registerTeam(props.tournament?.id, 1)
        }
    }

    const handleGenerateBracket = () => {
        if (props.tournament.id) {
            generateBracket(props.tournament.id)
        }
    }

    return <TableRow style={{color: "#123123"}}>
        <TableCell>
            <Typography color={"inherit"}>
                {`${props.tournament.name} (${props.tournament.teamRegistrations.length} / ${props.tournament.numberOfTeamsAllowed})`}
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
            <IconButton onClick={createDummyTeam}>
                <Edit/>
            </IconButton>
        </TableCell>
        <TableCell>
            <IconButton onClick={handleGenerateBracket}>
                <Dock/>
            </IconButton>
        </TableCell>
    </TableRow>
}