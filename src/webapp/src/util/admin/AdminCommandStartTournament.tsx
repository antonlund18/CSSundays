import * as React from "react"
import {useCallback, useMemo, useState} from "react"
import {TextField} from "@mui/material";
import {GetMatchByIdDocument, useStartTournamentMutation} from "../../codegen/generated-types";

export const AdminCommandStartTournament = () => {
    const [tournamentId, setTournamentId] = useState<string>("")
    const [startTournament] = useStartTournamentMutation()
    const [activeStep, setActiveStep] = useState<number>(0)

    const executeStartTournament = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            startTournament({
                variables: {
                    tournamentId: parseInt(tournamentId),
                },
                refetchQueries: [
                    GetMatchByIdDocument
                ]
            })
        }
    }

    const handleNextStep = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            setActiveStep(activeStep + 1)
        }
    }

    const handleChangeTournamentId = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setTournamentId("")
        }
        if (!isNaN(parseInt(e.target.value))) {
            setTournamentId(e.target.value)
        }
    }

    const activeSteps = useMemo(() => [{
        index: 0,
        step: <TextField sx={{width: "400px"}}
                         autoFocus
                         placeholder={"tournamentId"}
                         value={tournamentId}
                         onChange={handleChangeTournamentId}
                         onKeyDown={handleNextStep}/>
    }], [activeStep, tournamentId])


    const getActiveStep = useCallback((activeStep): JSX.Element => {
        const step = activeSteps.filter(step => step.index === activeStep)?.[0]?.step
        if (step) {
            return step
        }
        return <TextField sx={{width: "400px"}}
                          autoFocus
                          value={""}
                          onKeyDown={(e) => executeStartTournament(e)}
                          placeholder={"Press 'Enter' to confirm starting tournament"}/>
    }, [activeStep, tournamentId])

    return getActiveStep(activeStep)
}