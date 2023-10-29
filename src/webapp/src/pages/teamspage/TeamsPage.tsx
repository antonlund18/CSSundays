import * as React from "react";
import {useState} from "react";
import {
    Button,
    CircularProgress, Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {CenteredPage} from "../../components/CenteredPage";
import {CreateTeamDialog} from "./CreateTeamDialog";
import {useNavigate} from "react-router-dom";
import {Divider} from "../../components/Divider";
import {theme} from "../../theme/theme";
import {calculateWinrate} from "../../helpers/helpers";
import {useGetAllTeams} from "../../hooks/api/useTeam";
import {Team} from "../../codegen/generated-types";

const useStyles = makeStyles(theme => ({
    pageTitleContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    teamsPageInfoCell: {
        width: "32px",
    },
    teamTableRow: {
        cursor: "pointer",
    }
}))

export const TeamsPage = (): JSX.Element => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
    const {teams, loading} = useGetAllTeams()

    if (loading || !teams) {
        return <CircularProgress style={{position: "absolute", left: "50%", top: "50%"}}/>
    }

    const teamsSorted = teams.slice().sort((team1, team2) => {
        return team1.wins < team2.wins ? 1 : -1
    })

    const viewTeamPage = (team: Team) => {
        navigate("/teams/" + team.id)
    }

    return <CenteredPage>
        <div className={classes.pageTitleContainer}>
            <Typography variant={"h2"} color={"primary"}>Hold</Typography>
        </div>
        <Divider/>
        <TableContainer style={{maxHeight: "65vh"}}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.teamsPageInfoCell}/>
                        <TableCell>Navn</TableCell>
                        <TableCell className={classes.teamsPageInfoCell}>Wins</TableCell>
                        <TableCell className={classes.teamsPageInfoCell}>Losses</TableCell>
                        <TableCell className={classes.teamsPageInfoCell}>Winrate</TableCell>
                        {/*<TableCell className={classes.teamsPageInfoCell}>Point</TableCell>*/}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {teamsSorted.map((team: Team, index: number) => {
                        return <TableRow key={team.name} className={classes.teamTableRow}
                                         onClick={() => viewTeamPage(team)}>
                            <TableCell align={"right"}><Typography
                                variant={"h4"}>{index + 1 + "."}</Typography></TableCell>
                            <TableCell><Typography variant={"h4"}>{team.name}</Typography></TableCell>
                            <TableCell align={"right"}><Typography variant={"h4"}>{team.wins}</Typography></TableCell>
                            <TableCell align={"right"}><Typography variant={"h4"}>{team.losses}</Typography></TableCell>
                            <TableCell align={"right"}><Typography
                                variant={"h4"}>{calculateWinrate(team.wins, team.losses)}</Typography></TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <Grid container justifyContent={"flex-end"}>
            <Button color={"primary"} variant={"contained"} style={{marginTop: theme.spacing(2), alignSelf: "end"}}
                    onClick={() => setCreateDialogOpen(true)}>
                Opret hold
            </Button>
        </Grid>
        <CreateTeamDialog open={createDialogOpen} setOpen={setCreateDialogOpen}/>
    </CenteredPage>
}