import {CenteredPage} from "../../../components/CenteredPage";
import {Grid, Typography} from "@material-ui/core";
import {Divider as CSDivider} from "../../../components/Divider";
import * as React from "react";
import {useGetAllTournaments} from "../../../hooks/api/useTournament";
import {AdminTournamentsTable} from "./AdminTournamentsTable";

export const AdminTournamentsPage = (): JSX.Element => {
    const {tournaments} = useGetAllTournaments();

    if (!tournaments) {
        return <></>
    }

    return <CenteredPage fullWidth>
        <Typography variant={"h2"} color={"primary"}>Turneringsredigering (ADMIN)</Typography>
        <CSDivider/>
        <Grid container direction={"row"}>
            <Grid item xs={12} md={12}>
                <AdminTournamentsTable tournaments={tournaments} text={"Ikke-publicerede turneringer"}/>
            </Grid>
        </Grid>
    </CenteredPage>
}