import {IconButton, TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import * as React from "react";
import {Tournament} from "../../../codegen/generated-types";
import {formatDate} from "../../../helpers/helpers";
import {Dock, Edit, MoreVert} from "@mui/icons-material";
import {useTournaments} from "../../../hooks/api/useTournament";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AdminTournamentRowContextMenu} from "./AdminTournamentRowContextMenu";
import {useDateFormatter} from "../../../hooks/useDateFormatter";

interface AdminTournamentRowProps {
    tournament: Tournament
}

export const AdminTournamentRow = (props: AdminTournamentRowProps): JSX.Element => {
    const {formatDateTime} = useDateFormatter()
    const navigate = useNavigate()
    const [contextMenuOpen, setContextMenuOpen] = useState(false)
    const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)

    const handleOpenContextMenu = (e: React.MouseEvent<HTMLElement>) => {
        setContextMenuOpen(true)
        setContextMenuAnchor(e.currentTarget)
        e.preventDefault()
        e.stopPropagation()
    }

    return <TableRow style={{color: "#123123", cursor: "pointer"}}
                     onClick={() => navigate(`/tournaments/${props.tournament.id}`)}>
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
                {formatDateTime(props.tournament.startDateAndTime)}
            </Typography>
        </TableCell>
        <TableCell align={"right"}>
            <Typography color={"inherit"}>
                {formatDateTime(props.tournament.createdTs)}
            </Typography>
        </TableCell>
        <TableCell>
            <IconButton onClick={handleOpenContextMenu}>
                <MoreVert/>
            </IconButton>
            <AdminTournamentRowContextMenu open={contextMenuOpen} setOpen={setContextMenuOpen} anchor={contextMenuAnchor} tournament={props.tournament}/>
        </TableCell>
    </TableRow>
}