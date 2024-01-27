import * as React from "react"
import {useCallback, useMemo, useState} from "react"
import {TextField} from "@mui/material";
import {
    GetMatchByIdDocument, GetMatchesByParentIdsDocument,
    GetTournamentByIdDocument,
    useHandleMatchFinishedMutation
} from "../../codegen/generated-types";

export const AdminCommandHandleMatchFinished = () => {
    const [matchId, setMatchId] = useState<string>("")
    const [teamId, setTeamId] = useState<string>("")
    const [handleMatchFinished] = useHandleMatchFinishedMutation()
    const [activeStep, setActiveStep] = useState<number>(0)

    const executeStartTournament = (e: React.KeyboardEvent) => {

        if (e.code === "Enter") {
            handleMatchFinished({
                variables: {
                    matchId: parseInt(matchId),
                    winningTeamId: parseInt(teamId)
                },
                refetchQueries: [
                    GetTournamentByIdDocument,
                    GetMatchByIdDocument,
                    GetMatchesByParentIdsDocument
                ]
            })
        }
    }

    const handleNextStep = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            setActiveStep(activeStep + 1)
        }
    }

    const handleChangeMatchId = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setMatchId("")
        }
        if (!isNaN(parseInt(e.target.value))) {
            setMatchId(e.target.value)
        }
    }

    const handleChangeTeamId = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setTeamId("")
        }
        if (!isNaN(parseInt(e.target.value))) {
            setTeamId(e.target.value)
        }
    }

    const activeSteps = useMemo(() => [{
        index: 0,
        step: <TextField sx={{width: "400px"}}
                         autoFocus
                         placeholder={"matchId"}
                         value={matchId}
                         onChange={handleChangeMatchId}
                         onKeyDown={handleNextStep}/>
    }, {
        index: 1,
        step: <TextField sx={{width: "400px"}}
                         autoFocus
                         placeholder={"winningTeamId"}
                         value={teamId}
                         onChange={handleChangeTeamId}
                         onKeyDown={handleNextStep}/>
    }], [activeStep, matchId, teamId])


    const getActiveStep = useCallback((activeStep): JSX.Element => {
        const step = activeSteps.filter(step => step.index === activeStep)?.[0]?.step
        if (step) {
            return step
        }
        return <TextField sx={{width: "400px"}}
                          autoFocus
                          value={""}
                          onKeyDown={(e) => executeStartTournament(e)}
                          placeholder={"Press 'Enter' to confirm finishing match"}/>
    }, [activeStep, teamId, matchId])

    return getActiveStep(activeStep)
}