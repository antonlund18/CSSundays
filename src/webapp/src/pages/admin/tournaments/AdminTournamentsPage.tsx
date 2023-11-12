import {CenteredPage} from "../../../components/CenteredPage";
import {Button, Grid, Typography} from "@mui/material";
import {Divider as CSDivider} from "../../../components/Divider";
import * as React from "react";
import {useGetAllTournaments} from "../../../hooks/api/useTournament";
import {AdminTournamentsTable} from "./AdminTournamentsTable";
import {Link, useNavigate} from "react-router-dom";
import {theme} from "../../../theme/theme";

export const AdminTournamentsPage = (): JSX.Element => {
    const {tournaments} = useGetAllTournaments();
    const navigate = useNavigate()

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
        <Button color={"primary"} variant={"contained"} style={{margin: theme.spacing(1), alignSelf: "end"}}
                onClick={() => navigate("create")}>
            Opret turnering
        </Button>
    </CenteredPage>
}