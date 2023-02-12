import {Button, Dialog, DialogContent, Typography} from "@material-ui/core";
import {PannableContainer} from "../../../components/PannableContainer";
import {TournamentBracket} from "../bracket/TournamentBracket";
import {Team, Tournament} from "../../../codegen/generated-types";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {useTournaments} from "../../../hooks/api/useTournament";
import {useState} from "react";

interface BracketTabContentProps {
    tournament: Tournament
}

export const BracketTabContent = (props: BracketTabContentProps): JSX.Element => {
    const {currentUser} = useGetCurrentUser()
    const {registerTeam} = useTournaments()
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenRegistrationDialog = (open: boolean) => {
        setDialogOpen(open)
    }

    const handleRegisterTeam = (team: Team) => {
        if (props.tournament.id && team.id) {
            registerTeam(props.tournament.id, team.id)
        }
    }

    return <>
        <PannableContainer style={{backgroundColor: "white", borderRadius: "8px"}}>
            <TournamentBracket bracket={props.tournament.bracket}/>
        </PannableContainer>
        <Button variant={"contained"} color={"primary"} style={{marginTop: "16px"}}
                onClick={() => handleOpenRegistrationDialog(true)}>
            Tilmeld hold
        </Button>
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
    </>
}