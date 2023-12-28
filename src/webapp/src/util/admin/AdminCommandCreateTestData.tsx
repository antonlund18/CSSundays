import * as React from "react"
import {TextField} from "@mui/material";
import {useCreateTestDataMutation} from "../../codegen/generated-types";

export const AdminCommandCreateTestData = () => {
    const [createTestData] = useCreateTestDataMutation()

    const handleCreateMatch = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            createTestData()
        }
    }

    return <TextField sx={{width: "400px"}} autoFocus onKeyDown={(e) => handleCreateMatch(e)} placeholder={"Press 'Enter' to confirm creating match"}/>
}
