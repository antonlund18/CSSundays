import {CenteredPage} from "../../components/CenteredPage";
import {Grid, makeStyles, Typography} from "@material-ui/core";
import {Divider as CSDivider} from "../../components/Divider";
import * as React from "react";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {UserRole} from "../../codegen/generated-types";
import {useGetAllTournaments} from "../../hooks/api/useTournament";
import {AdminTournamentsTable} from "./AdminTournamentsTable";

const useStyles = makeStyles(theme => ({
    headerText: {
        borderLeft: "1px solid " + theme.palette.primary.main,
        paddingLeft: theme.spacing(1)
    }
}))

export const AdminTournamentsPage = (): JSX.Element => {
    const {currentUser} = useGetCurrentUser();
    const {tournaments} = useGetAllTournaments();

    if (!tournaments) {
        return <></>
    }

    const sortedTournaments = tournaments.slice().sort((t1, t2) => Date.parse(t1.createdTs) - Date.parse(t2.createdTs))

    if (currentUser?.role !== UserRole.Admin && currentUser?.role !== UserRole.Organizer) {
        return <>You are not allowed to view this page</>
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