import {Dialog, DialogContent, DialogTitle, Divider, Typography} from "@mui/material"
import * as React from "react"
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {makeStyles} from "@mui/styles";
import {TournamentRegistrationDialogNewRegistration} from "./TournamentRegistrationDialogNewRegistration";
import {TournamentRegistrationDialogAlreadyRegistered} from "./TournamentRegistrationDialogAlreadyRegistered";
import {
    Tournament,
    TournamentRegistration,
    useGetTournamentRegistrationByPlayerQuery
} from "../../../codegen/generated-types";

const useStyles = makeStyles(theme => ({
    dialog: {
        height: "400px",
        width: "600px",
    }
}))

export type TournamentRegistrationDialogProps = {
    open: boolean
    setOpen: (open: boolean) => void
    tournament: Tournament
}

export const TournamentRegistrationDialog = (props: TournamentRegistrationDialogProps) => {
    const {currentUser} = useGetCurrentUser()
    const {data} = useGetTournamentRegistrationByPlayerQuery({
        variables: {
            tournamentId: props.tournament.id ?? -1,
            playerId: currentUser?.id ?? -1
        }
    })

    const existingTournamentRegistrationForPlayer = data?.getTournamentRegistrationByPlayer as TournamentRegistration

    if (!currentUser) {
        return <></>
    }

    return <Dialog open={props.open} onClose={() => props.setOpen(false)} maxWidth={"xl"}>
        <DialogTitle><Typography variant={"h2"} style={{textTransform: "none"}}>Tilmeld
            turnering</Typography></DialogTitle>
        <Divider/>
        <DialogContent sx={{padding: 0, margin: 0, height: "400px", width: "600px"}}>
            {!existingTournamentRegistrationForPlayer ?
                <TournamentRegistrationDialogNewRegistration tournament={props.tournament}
                                                             currentUser={currentUser}/>
                : <TournamentRegistrationDialogAlreadyRegistered tournamentRegistration={existingTournamentRegistrationForPlayer} currentUser={currentUser}/>}
        </DialogContent>
    </Dialog>
}