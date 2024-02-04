import * as React from "react"
import {useCallback, useMemo, useState} from "react"
import {TextField} from "@mui/material";
import {GetMatchByIdDocument, useDeleteUserMutation, useStartTournamentMutation} from "../../codegen/generated-types";


export const AdminCommandDeleteUser = (props: {closeAdminCommands: () => void }) => {
    const [userId, setUserId] = useState<string>("")
    const [deleteUser] = useDeleteUserMutation()
    const [activeStep, setActiveStep] = useState<number>(0)

    const executeStartTournament = async (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            await deleteUser({
                variables: {
                    userId: parseInt(userId),
                },
                refetchQueries: [
                    GetMatchByIdDocument
                ]
            })
            props.closeAdminCommands()
        }

    }

    const handleNextStep = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            setActiveStep(activeStep + 1)
        }
    }

    const handleChangeTournamentId = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length === 0) {
            setUserId("")
        }
        if (!isNaN(parseInt(e.target.value))) {
            setUserId(e.target.value)
        }
    }

    const activeSteps = useMemo(() => [{
        index: 0,
        step: <TextField sx={{width: "400px"}}
                         autoFocus
                         placeholder={"userId"}
                         value={userId}
                         onChange={handleChangeTournamentId}
                         onKeyDown={handleNextStep}/>
    }], [activeStep, userId])


    const getActiveStep = useCallback((activeStep): JSX.Element => {
        const step = activeSteps.filter(step => step.index === activeStep)?.[0]?.step
        if (step) {
            return step
        }
        return <TextField sx={{width: "400px"}}
                          autoFocus
                          value={""}
                          onKeyDown={(e) => executeStartTournament(e)}
                          placeholder={"Press 'Enter' to confirm deleting user"}/>
    }, [activeStep, userId])

    return getActiveStep(activeStep)
}