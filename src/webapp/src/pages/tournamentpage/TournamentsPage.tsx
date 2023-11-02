import * as React from "react";
import {
    Button,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {CenteredPage} from "../../components/CenteredPage";
import {Divider} from "../../components/Divider";
import {theme} from "../../theme/theme";
import {Link, useNavigate} from "react-router-dom";
import {useGetAllTournaments} from "../../hooks/api/useTournament";

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
        <Divider/>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell>Dato</TableCell>
                    <TableCell>Tidspunkt</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Præmier</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tournaments.map((tournament: any) => {
                    return <TableRow key={tournament.name}
                                     style={{
                                         cursor: "pointer",
                                         textDecoration: new Date(tournament.startDateAndTime).valueOf() < Date.now() ? "line-through" : "none"}}
                                     onClick={() => navigate(`/tournaments/${tournament.id}`)}>
                        <TableCell><Typography variant={"h4"}>{tournament.name}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>{new Date(tournament.startDateAndTime).toLocaleDateString("da", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>14:00</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>{tournament.status}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>$1000</Typography></TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
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