import * as React from "react";
import {Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import {CenteredPage} from "../../components/CenteredPage";
import {Divider} from "../../components/Divider";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {UserRole} from "../../codegen/generated-types";
import {theme} from "../../theme/theme";
import {CreateTournamentDialog} from "./CreateTournamentDialog";
import {useState} from "react";
import {Link} from "react-router-dom";

const testTournaments = [
    {
        id: 1,
        name: "CSSundays #1",
        date: new Date(2022, 3, 1),
        time: "15:00",
        status: "Åben for tilmeldinger",
        prizePool: "1000 DKK",
    },
    {
        id: 2,
        name: "CSSundays #2",
        date: new Date(2022, 4, 1),
        time: "15:00",
        status: "Åben for tilmeldinger",
        prizePool: "1000 DKK",
    },
    {
        id: 3,
        name: "CSSundays #3",
        date: new Date(2022, 5, 1),
        time: "15:00",
        status: "Åben for tilmeldinger",
        prizePool: "1000 DKK",
    },
    {
        id: 4,
        name: "CSSundays #4",
        date: new Date(2022, 1, 1),
        time: "15:00",
        status: "Afviklet",
        prizePool: "1000 DKK",
    },
]

export const TournamentPage = (): JSX.Element => {
    const {currentUser} = useGetCurrentUser();
    const isCurrentUserAdminOrOrganizer = currentUser && (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Organizer)
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

    testTournaments.sort((tournament1, tournament2) => {
        return tournament1.date < tournament2.date ? 1 : -1
    })

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
                {testTournaments.map(tournament => {
                    return <TableRow key={tournament.name}
                                     style={tournament.date.valueOf() < Date.now() ? {textDecoration: "line-through"} : {}}>
                        <TableCell><Typography variant={"h4"}>{tournament.name}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>{tournament.date.toLocaleDateString("da", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>{tournament.time}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>{tournament.status}</Typography></TableCell>
                        <TableCell><Typography variant={"h4"}>{tournament.prizePool}</Typography></TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
        {isCurrentUserAdminOrOrganizer && <>
            <Grid container justifyContent={"flex-end"}>
                <Link to={"/tournaments/admin"} style={{textDecoration: "none"}}>
                    <Button color={"primary"} variant={"contained"} style={{margin: theme.spacing(1), alignSelf: "end"}}>
                        Rediger turneringer
                    </Button>
                </Link>
                <Button color={"primary"} variant={"contained"} style={{margin: theme.spacing(1), alignSelf: "end"}}
                        onClick={() => setCreateDialogOpen(true)}>
                    Opret turnering
                </Button>
            </Grid>
            <CreateTournamentDialog open={createDialogOpen} setOpen={setCreateDialogOpen}/>
        </>}
    </CenteredPage>
}