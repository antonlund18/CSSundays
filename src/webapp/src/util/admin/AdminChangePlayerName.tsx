import * as React from "react"
import {TextField} from "@mui/material";
import {useChangePasswordMutation, useCreateTestMatchMutation} from "../../codegen/generated-types";
import {useState} from "react";

enum Types {
    NUMBER,
    STRING
}

type Parameter = {
    name: string
    type: Types
}

type AdminCommandChangePlayerNameProps = {
}

export const AdminCommandCreateMatch = (props: AdminCommandChangePlayerNameProps) => {
    const [createTestMatch] = useCreateTestMatchMutation()

    const handleCreateMatch = (e: React.KeyboardEvent) => {
        if (e.code === "Enter") {
            createTestMatch()
        }
    }

    return <TextField sx={{width: "400px"}} autoFocus onKeyDown={(e) => handleCreateMatch(e)}/>
}