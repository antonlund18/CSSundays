import {Button, CircularProgress, Dialog, DialogContent, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {PannableContainer} from "../../../components/PannableContainer";
import {TournamentBracket} from "../bracket/TournamentBracket";
import {Team, Tournament} from "../../../codegen/generated-types";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {useTournaments} from "../../../hooks/api/useTournament";
import {useState} from "react";

const useStyles = makeStyles({
    bracketNotYetCreated: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    }
})

interface BracketTabContentProps {
    tournament: Tournament
}

export const BracketTabContent = (props: BracketTabContentProps): JSX.Element => {
    const classes = useStyles()
    const {currentUser} = useGetCurrentUser()
    const {registerTeam} = useTournaments()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const handleOpenRegistrationDialog = (open: boolean) => {
        setDialogOpen(open)
    }

    const handleRegisterTeam = (team: Team) => {
        if (props.tournament.id && team.id) {
            registerTeam(props.tournament.id, team.id)
        }
    }

    const hasBracketBeenCreated = props.tournament.bracket !== null

    return <>
        <PannableContainer style={{backgroundColor: "white"}}>
            {!hasBracketBeenCreated ? <Typography variant={"h2"} className={classes.bracketNotYetCreated}>Der er ikke oprettet en bracket endnu ⌛</Typography> :
                <>
                    {isLoading && <CircularProgress style={{position: "absolute", left: "50%", top: "50%"}}/>}
                    <div style={{display: isLoading ? "none" : "block"}}>
                        <TournamentBracket bracket={props.tournament.bracket} setIsLoading={setIsLoading}/>
                    </div>
                </>}
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