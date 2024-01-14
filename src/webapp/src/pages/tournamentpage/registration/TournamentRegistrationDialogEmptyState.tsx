import * as React from "react"
import {Button, Typography} from "@mui/material";

type TournamentRegistrationDialogEmptyStateProps = {
    setRegistrationDialogOpen: (open: boolean) => void
    setCreateTeamDialogOpen: (open: boolean) => void
}

export const TournamentRegistrationDialogEmptyState = (props: TournamentRegistrationDialogEmptyStateProps) => {

    const handleClick = () => {
        props.setRegistrationDialogOpen(false)
        props.setCreateTeamDialogOpen(true)
    }

    return <div style={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
    }}>
        <Typography>
            Du er ikke tilmeldt nogle hold<br/>
            Opret et hold for at tilmelde dig turneringen
        </Typography>
        <Button onClick={handleClick}>Opret hold</Button>
    </div>
}