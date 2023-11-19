import * as React from "react"
import {Menu, MenuItem} from "@mui/material";
import {
    Tournament,
    usePublishTournamentMutation,
    useRemovePublicationFromTournamentMutation
} from "../../../codegen/generated-types";
import {useContext} from "react";
import {SnackbarContext} from "../../../SnackbarContextProvider";

type AdminTournamentRowContextMenuProps = {
    open: boolean
    setOpen: (open: boolean) => void
    anchor: HTMLElement | null
    tournament: Tournament
}

export const AdminTournamentRowContextMenu = (props: AdminTournamentRowContextMenuProps) => {
    const {openSnackbar} = useContext(SnackbarContext)
    const [publishTournament] = usePublishTournamentMutation()
    const [removePublication] = useRemovePublicationFromTournamentMutation()

    const handleClose = (e: React.MouseEvent) => {
        props.setOpen(false)
        handleClick(e)
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
    }

    const handlePublish = () => {
        if (!props.tournament.id) {
            return
        }

        publishTournament({
            variables: {
                tournamentId: props.tournament.id
            }
        })
        openSnackbar(`'${props.tournament.name}' blev publiceret`, "success")
        props.setOpen(false)
    }

    const handleRemovePublication = () => {
        if (!props.tournament.id) {
            return
        }

        removePublication({
            variables: {
                tournamentId: props.tournament.id
            }
        })
        openSnackbar(`'${props.tournament.name}' er ikke længere publiceret`, "success")
        props.setOpen(false)
    }

    return <Menu open={props.open} onClose={handleClose} anchorEl={props.anchor} onClick={handleClick}>
        <MenuItem onClick={() => props.tournament.published ? handleRemovePublication() : handlePublish()}>
            {props.tournament.published ? "Fjern publicering" : "Publicér"}
        </MenuItem>
    </Menu>
}