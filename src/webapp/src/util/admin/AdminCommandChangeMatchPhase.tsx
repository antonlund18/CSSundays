import * as React from "react"
import {useCallback, useMemo, useState} from "react"
import {IconButton, TextField, Tooltip, Typography} from "@mui/material";
import {ChangeMatchPhaseStrategy, useChangeMatchPhaseMutation} from "../../codegen/generated-types";
import {PriorityHigh} from "@mui/icons-material";

export const AdminCommandChangeMatchPhase = () => {
    const [matchId, setMatchId] = useState<string>("")
    const [matchPhase, setMatchPhase] = useState<string>("")
    const [activeStep, setActiveStep] = useState<number>(0)
    const [changeMatchPhase] = useChangeMatchPhaseMutation()
    const strategies = Object.entries(ChangeMatchPhaseStrategy)

    const executeChangeMatchPhase = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            changeMatchPhase({
                variables: {
                    matchId: parseInt(matchId),
                    changeMatchPhaseStrategy: strategies[parseInt(matchPhase)][1] ?? ChangeMatchPhaseStrategy.WaitingToStart
                }
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

    const handleChangeMatchPhase = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setMatchPhase("")
        }
        if (!isNaN(parseInt(e.target.value))) {
            setMatchPhase(e.target.value)
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
                         placeholder={"matchPhase"}
                         value={matchPhase}
                         onChange={handleChangeMatchPhase}
                         onKeyDown={handleNextStep}
                         InputProps={{
                             endAdornment:
                                 <Tooltip title={
                                     <>{strategies.map((value, index) =>
                                         <Typography>{`${index}: ${value[0]}`}</Typography>)}
                                     </>}
                                 >
                                     <IconButton>
                                         <PriorityHigh/>
                                     </IconButton>
                                 </Tooltip>
                         }}/>
    }], [activeStep, matchId, matchPhase])


    const getActiveStep = useCallback((activeStep): JSX.Element => {
        const step = activeSteps.filter(step => step.index === activeStep)?.[0]?.step
        if (step) {
            return step
        }
        return <TextField sx={{width: "400px"}}
                          autoFocus
                          value={""}
                          onKeyDown={(e) => executeChangeMatchPhase(e)}
                          placeholder={"Press 'Enter' to confirm creating match"}/>
    }, [activeStep, matchPhase, matchId])


    return getActiveStep(activeStep)
}