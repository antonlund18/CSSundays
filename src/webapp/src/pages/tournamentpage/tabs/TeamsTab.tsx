import * as React from "react"
import {useMemo, useState} from "react"
import {TournamentRegistration} from "../../../codegen/generated-types"
import {TeamRow} from "./TeamRow";
import {
    Grid, InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {HeadCell} from "../../../components/TableTypes";
import {TableHeadSortWrapper} from "../../../components/TableHeadSortWrapper";
import {useTournamentRegistrationSort} from "../../../hooks/useTournamentRegistrationSort";
import {SortDirection, SortOption} from "../../../components/SortTypes";
import {Search} from "@mui/icons-material";

type TeamsTabProps = {
    tournamentRegistrations: TournamentRegistration[]
}

export const TeamsTab = (props: TeamsTabProps): JSX.Element => {
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC)
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.NUMBER)
    const [searchText, setSearchText] = useState<string>("")
    const getSortPredicate = useTournamentRegistrationSort()

    const handleRequestSort = (event: React.MouseEvent<unknown>, sortOption: SortOption) => {
        const isAsc = sortOption === sortBy && sortDirection === SortDirection.ASC
        setSortDirection(isAsc ? SortDirection.DESC : SortDirection.ASC)
        setSortBy(sortOption)
    }

    const createSortHandler = (sortOption?: SortOption) => (event: React.MouseEvent<unknown>) => {
        if (sortOption) handleRequestSort(event, sortOption)
        return () => null
    }

    const headCells: HeadCell[] = [
        {
            id: "number",
            sortOption: SortOption.NUMBER,
            numeric: false,
            disablePadding: false,
            label: '#',
        },
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

    const tournamentRegistrationEntries = useMemo(() => {
        return props.tournamentRegistrations.map((registration, index) => {
            return {registration: registration, number: index + 1}
        })
    }, [props.tournamentRegistrations])

    const filteredRegistrationEntries = useMemo(() => {
        return tournamentRegistrationEntries.slice().filter(entry => entry.registration.team.name.toLowerCase().includes(searchText.toLowerCase()))
    }, [tournamentRegistrationEntries, searchText])

    const sortedRegistrationEntries = useMemo(() => {
        return filteredRegistrationEntries.slice().sort(getSortPredicate(sortBy, sortDirection))
    }, [tournamentRegistrationEntries, sortDirection, sortBy, filteredRegistrationEntries])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    return <Grid container spacing={2}>
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
                        <col style={{width: "0%"}}/>
                        <col style={{width: "60%"}}/>
                        <col style={{width: "40%"}}/>
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            {headCells.map(headCell => {
                                    return <TableCell key={headCell.id}
                                                      align={headCell.numeric ? "right" : "left"}
                                                      padding={headCell.disablePadding ? "none" : "normal"}
                                                      sortDirection={sortBy === headCell.sortOption ? sortDirection : false}>
                                        <TableHeadSortWrapper condition={!!headCell.sortOption}
                                                              active={sortBy === headCell.sortOption}
                                                              direction={sortBy === headCell.sortOption ? sortDirection : SortDirection.ASC}
                                                              onClick={createSortHandler(headCell.sortOption)}>
                                            <Typography variant={"button"}>{headCell.label}</Typography>
                                        </TableHeadSortWrapper>
                                    </TableCell>
                                }
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRegistrationEntries.map((entry) => {
                            return <TeamRow team={entry.registration.team} index={entry.number}/>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>
}