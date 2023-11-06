import React from "react";
import {Button, CircularProgress, Divider, Grid, Stack, Typography} from "@mui/material";
import {CenteredPage} from "../../components/CenteredPage";
import {Link, useNavigate} from "react-router-dom";
import {useGetAllTournaments} from "../../hooks/api/useTournament";
import {Divider as CSDivider} from "../../components/Divider";
import {TournamentRow} from "./TournamentRow";
import {theme} from "../../theme/theme";

export const TournamentsPage = (): JSX.Element => {
    // const isCurrentUserAdminOrOrganizer = currentUser && (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Organizer)
    const isCurrentUserAdminOrOrganizer = true
    const {tournaments} = useGetAllTournaments()
    const navigate = useNavigate()

    if (!tournaments) {
        return <CircularProgress style={{position: "absolute", left: "50%", top: "50%"}}/>
    }

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"}>Turneringer</Typography>
        <CSDivider/>
        <Grid container spacing={2}>
            <Stack divider={<Divider flexItem/>} spacing={2} sx={{width: "100%"}}>
                {tournaments.map((tournament) => {
                    return <TournamentRow tournament={tournament}/>
                })}
            </Stack>
        </Grid>
        {isCurrentUserAdminOrOrganizer && <>
            <Grid container justifyContent={"flex-end"}>
                <Link to={"/tournaments/admin"} style={{textDecoration: "none"}}>
                    <Button color={"primary"} variant={"contained"}
                            style={{margin: theme.spacing(1), alignSelf: "end"}}>
                        Rediger turneringer
                    </Button>
                </Link>
                <Button color={"primary"} variant={"contained"} style={{margin: theme.spacing(1), alignSelf: "end"}}
                        onClick={() => navigate("admin/create")}>
                    Opret turnering
                </Button>
            </Grid>
        </>}
    </CenteredPage>
}