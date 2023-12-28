import React from "react";
import {CircularProgress, Divider, Grid, Stack, Typography} from "@mui/material";
import {CenteredPage} from "../../components/CenteredPage";
import {useGetAllTournaments} from "../../hooks/api/useTournament";
import {Divider as CSDivider} from "../../components/Divider";
import {TournamentRow} from "./TournamentRow";

export const TournamentsPage = (): JSX.Element => {
    const {tournaments} = useGetAllTournaments()

    if (!tournaments) {
        return <CircularProgress style={{position: "absolute", left: "50%", top: "50%"}}/>
    }

    const publishedTournaments = tournaments.filter(tournament => tournament.published)
    const sortedTournaments = publishedTournaments.sort((t1, t2) => new Date(t2.startDateAndTime).getTime() - new Date(t1.startDateAndTime).getTime())

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"}>Turneringer</Typography>
        <CSDivider/>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Stack divider={<Divider flexItem/>} spacing={2} sx={{width: "100%"}}>
                    {sortedTournaments.map((tournament) => {
                        return <TournamentRow tournament={tournament}/>
                    })}
                </Stack>
            </Grid>
        </Grid>
    </CenteredPage>
}