import {useGetTournamentById, useTournaments} from "../../hooks/api/useTournament";
import {useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {TournamentBracket} from "./bracket/TournamentBracket";
import {Button, Dialog, DialogContent, Typography} from "@material-ui/core";
import {useState} from "react";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {Team} from "../../codegen/generated-types";
import {PannableContainer} from "../../components/PannableContainer";

export const TournamentPage = () => {
    const urlParams = useParams();
    const {tournament} = useGetTournamentById(parseInt(urlParams.tournamentId ?? "-1"))
    const [dialogOpen, setDialogOpen] = useState(false)
    const {currentUser} = useGetCurrentUser()
    const {registerTeam} = useTournaments()

    if (!tournament || !tournament.id) {
        return <CenteredPage/>
    }

    const handleOpenRegistrationDialog = (open: boolean) => {
        setDialogOpen(open)
    }

    const handleRegisterTeam = (team: Team) => {
        if (tournament.id && team.id) {
            registerTeam(tournament.id, team.id)
        }
    }

    return <CenteredPage>
        <Button variant={"contained"} color={"primary"} style={{marginBottom: "16px"}}
                onClick={() => handleOpenRegistrationDialog(true)}>
            Tilmeld hold
        </Button>
        <PannableContainer>
            <TournamentBracket bracket={tournament.bracket}/>
        </PannableContainer>
        {currentUser &&
        <Dialog open={dialogOpen} onClose={() => handleOpenRegistrationDialog(false)}>
            <DialogContent>
                {currentUser.teams.map(team => {
                    return <div style={{display: "flex"}}>
                        <Typography>{team.name}</Typography>
                        <Button onClick={() => handleRegisterTeam(team)}>Vælg</Button>
                    </div>
                })}
            </DialogContent>
        </Dialog>}

    </CenteredPage>
}