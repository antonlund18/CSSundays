import * as React from "react"
import {useMemo, useState} from "react"
import {SortDirection, SortOption} from "../../../components/SortTypes";
import {HeadCell} from "../../../components/TableTypes";
import {
    Grid,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Search} from "@mui/icons-material";
import {TableHeadSortWrapper} from "../../../components/TableHeadSortWrapper";
import {Team} from "../../../codegen/generated-types";
import {PlayerTeamsTabTeamRow} from "./PlayerTeamsTabTeamRow";
import {useTeamSort} from "../../../hooks/useTeamSort";

type PlayerTeamsTabTeamListProps = {
    teams: Team[]
}

export const PlayerTeamsTabTeamList = (props: PlayerTeamsTabTeamListProps): JSX.Element => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC)
    const [searchText, setSearchText] = useState<string>("")
    const getSortPredicate = useTeamSort()

    const handleRequestSort = () => {
        setSortDirection(sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC)
    }

    const headCells: HeadCell[] = [
        {
            id: "name",
            sortOption: SortOption.NAME,
            numeric: false,
            disablePadding: false,
            label: 'Hold',
        },
        {
            id: "players",
            numeric: false,
            disablePadding: false,
            label: 'Spillere',
        }
    ]

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    const filteredTeams = useMemo(() => {
        return props.teams.slice().filter(team => team.name.toLowerCase().includes(searchText.toLowerCase()))
    }, [props.teams, searchText])

    const sortedTeams = useMemo(() => {
        return filteredTeams.slice().sort(getSortPredicate(sortDirection))
    }, [props.teams, sortDirection, filteredTeams])

    return <>
        <Grid item xs={12}>
            <TextField style={{width: "100%"}}
                       InputProps={{startAdornment: <InputAdornment position={"start"}><Search/></InputAdornment>}}
                       placeholder={"Søg efter hold..."}
                       onChange={handleSearch}
            />
        </Grid>

        <Grid item xs={12}>
            <TableContainer style={{maxHeight: "55vh", overflowX: "hidden"}}>
                <Table stickyHeader>
                    <colgroup>
                        <col style={{width: "50%"}}/>
                        <col style={{width: "50%"}}/>
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            {headCells.map(headCell => {
                                    return <TableCell key={headCell.id}
                                                      align={headCell.numeric ? "right" : "left"}
                                                      padding={headCell.disablePadding ? "none" : "normal"}
                                                      sortDirection={sortDirection}>
                                        <TableHeadSortWrapper condition={!!headCell.sortOption}
                                                              direction={sortDirection}
                                                              onClick={handleRequestSort}>
                                            <Typography variant={"button"}>{headCell.label}</Typography>
                                        </TableHeadSortWrapper>
                                    </TableCell>
                                }
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedTeams.map((team) => {
                            return <PlayerTeamsTabTeamRow team={team}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </>
}