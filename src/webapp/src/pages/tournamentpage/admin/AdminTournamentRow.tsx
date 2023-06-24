import {IconButton, TableCell, TableRow, Tooltip, Typography} from "@material-ui/core";
import * as React from "react";
import {Tournament} from "../../../codegen/generated-types";
import {formatDate} from "../../../helpers/helpers";
import {Dock, Edit} from "@material-ui/icons";
import {useTournaments} from "../../../hooks/api/useTournament";
import {useNavigate} from "react-router-dom";

interface AdminTournamentRowProps {
    tournament: Tournament
}

export const AdminTournamentRow = (props: AdminTournamentRowProps): JSX.Element => {
    const date = formatDate(new Date(props.tournament.createdTs))
    const {registerTeam, generateBracket} = useTournaments()
    const navigate = useNavigate()

    const createDummyTeam = (e: React.MouseEvent) => {
        if (props.tournament.id) {
            registerTeam(props.tournament?.id, 1)
        }
        e.preventDefault()
        e.stopPropagation()
    }

    const handleGenerateBracket = (e: React.MouseEvent) => {
        if (props.tournament.id) {
            generateBracket(props.tournament.id)
        }
        e.preventDefault()
        e.stopPropagation()
    }

    return <TableRow style={{color: "#123123", cursor: "pointer"}} onClick={() => navigate(`/tournaments/${props.tournament.id}`)}>
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
                {props.tournament.startDateAndTime}
            </Typography>
        </TableCell>
        <TableCell align={"right"}>
            <Typography color={"inherit"}>
                {date}
            </Typography>
        </TableCell>
        <TableCell>
            <Tooltip title={"Rediger"}>
                <IconButton onClick={createDummyTeam}>
                    <Edit/>
                </IconButton>
            </Tooltip>
        </TableCell>
        <TableCell>
            <Tooltip title={"Generer bracket"}>
                <IconButton onClick={handleGenerateBracket}>
                    <Dock/>
                </IconButton>
            </Tooltip>
        </TableCell>
    </TableRow>
}