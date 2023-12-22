import * as React from "react"
import {TextField} from "@mui/material";
import {useCreateTestMatchMutation} from "../../codegen/generated-types";

export const AdminCommandCreateMatch = () => {
    const [createTestMatch] = useCreateTestMatchMutation()

    const handleCreateMatch = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            createTestMatch()
        }
    }

    return <TextField sx={{width: "400px"}} autoFocus onKeyDown={(e) => handleCreateMatch(e)} placeholder={"Press 'Enter' to confirm creating match"}/>
}