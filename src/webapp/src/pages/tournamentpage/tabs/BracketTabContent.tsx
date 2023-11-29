import {Button, ButtonGroup, CircularProgress, Dialog, DialogContent, Divider, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import {PannableContainer} from "../../../components/PannableContainer";
import {TournamentBracket} from "../bracket/TournamentBracket";
import {Team, Tournament} from "../../../codegen/generated-types";
import {useGetCurrentUser} from "../../../hooks/api/useUser";
import {useTournaments} from "../../../hooks/api/useTournament";
import {useContext, useState} from "react";
import {BracketContext} from "./BracketContextProvider";
import {theme} from "../../../theme/theme";

const useStyles = makeStyles({
    bracketNotYetCreated: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) !important",
        textAlign: "center",
        transformOrigin: "center"
    },
    roundsToBeShownController: {
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "1px solid " + theme.palette.primary.main,
        borderRadius: "4px"
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
    const {
        numberOfRoundsToBeShown,
        increaseNumberOfRoundsShown,
        decreaseNumberOfRoundsShown
    } = useContext(BracketContext)

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
        <div style={{display: "flex", height: "40px", marginBottom: "16px", alignItems: "center", justifyContent: "center"}}>
            <Typography variant={"subtitle2"} marginRight={"16px"}>Vis antal runder: </Typography>
            <div className={classes.roundsToBeShownController}>
                <div style={{width: "40px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Typography variant={"h4"}>{numberOfRoundsToBeShown}</Typography>
                </div>
                <Button variant={"text"} onClick={increaseNumberOfRoundsShown} style={{width: "40px", minWidth: "0"}}>+</Button>
                <Divider orientation={"vertical"} flexItem/>
                <Button variant={"text"} onClick={decreaseNumberOfRoundsShown} style={{width: "40px", minWidth: "0"}}>-</Button>
            </div>
        </div>
        <PannableContainer style={{backgroundColor: "white"}}>
            {!hasBracketBeenCreated ? <div className={classes.bracketNotYetCreated}>
                    <Typography variant={"h2"}>Der er ikke oprettet en bracket endnu</Typography>
                    <Typography variant={"h4"}>Kom tilbage senere ☕</Typography>
                </div> :
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
        {
            currentUser &&
            <Dialog open={dialogOpen} onClose={() => handleOpenRegistrationDialog(false)}>
                <DialogContent>
                    {currentUser.teams.map(team => {
                        return <div style={{display: "flex"}}>
                            <Typography>{team.name}</Typography>
                            <Button onClick={() => handleRegisterTeam(team)}>Vælg</Button>
                        </div>
                    })}
                </DialogContent>
            </Dialog>
        }
    </>
}