import * as React from "react"
import {useContext} from "react"
import {Menu, MenuItem} from "@mui/material";
import {
    Tournament, useGenerateBracketMutation,
    usePublishTournamentMutation,
    useRemovePublicationFromTournamentMutation, useStartTournamentMutation
} from "../../../codegen/generated-types";
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
    const [generateBracket] = useGenerateBracketMutation()
    const [startTournament] = useStartTournamentMutation()

    if (!props.tournament) {
        return <></>
    }

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
        }).then(data => {
            openSnackbar(`'${props.tournament.name}' er ikke længere publiceret`, "success")
        }).catch(error => {
            openSnackbar('Fejl ved publicering', 'error')
        })
        props.setOpen(false)
    }

    const handleGenerateBracket = () => {
        if (!props.tournament.id) {
            return
        }

        generateBracket({
            variables: {
                tournamentId: props.tournament.id
            }
        }).then(data => {
            openSnackbar(`Bracket oprettet for '${props.tournament.name}'`, "success")
        }).catch(error => {
            openSnackbar('Fejl ved oprettelse af bracket', 'error')
        })
        props.setOpen(false)
    }

    const handleStartTournament = () => {
        if (!props.tournament.id) {
            return
        }

        startTournament({
            variables: {
                tournamentId: props.tournament.id
            }
        }).then(data => {
            openSnackbar(`Turnering startet: '${props.tournament.name}'`, "success")
        }).catch(error => {
            openSnackbar('Fejl ved start af turnering', 'error')
        })
        props.setOpen(false)
    }

    return <Menu open={props.open} onClose={handleClose} anchorEl={props.anchor} onClick={handleClick}>
        <MenuItem onClick={() => props.tournament.published ? handleRemovePublication() : handlePublish()}>
            {props.tournament.published ? "Fjern publicering" : "Publicér"}
        </MenuItem>
        <MenuItem onClick={handleGenerateBracket}>
            Opret bracket
        </MenuItem>
        <MenuItem onClick={handleStartTournament}>
            Start turnering
        </MenuItem>

    </Menu>
}