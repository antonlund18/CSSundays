import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    InputAdornment,
    Table,
    TableBody,
    TableContainer,
    TextField
} from "@mui/material";
import {AdminTournamentRow} from "./AdminTournamentRow";
import * as React from "react";
import {useMemo, useState} from "react";
import {Tournament} from "../../../codegen/generated-types";
import {Search} from "@mui/icons-material";
import {useFilterTournaments} from "../../../hooks/tournaments/useFilterTournaments";
import {AdminTournamentsTableHead} from "./AdminTournamentsTableHead";
import {makeStyles} from "@mui/styles";
import {useTournamentSort} from "../../../hooks/useTournamentSort";
import {SortDirection, SortOption} from "../../../components/SortTypes";
import {theme} from "../../../theme/theme";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    headerText: {
        borderLeft: "1px solid " + theme.palette.primary.main,
        paddingLeft: theme.spacing(1)
    },
    table: {
        width: "1200px",
    },
}))

interface AdminAllTournamentsTableProps {
    tournaments: Tournament[]
    text: string
}

export const AdminTournamentsTable = (props: AdminAllTournamentsTableProps): JSX.Element => {
    const classes = useStyles()
    const [showPublished, setShowPublished] = useState<boolean>(true)
    const [showNotPublished, setShowNotPublished] = useState<boolean>(true)
    const [search, setSearch] = useState<string>("")
    const filterTournaments = useFilterTournaments()
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC)
    const [sortBy, setSortBy] = useState<SortOption>(SortOption.CREATED)
    const getSortPredicate = useTournamentSort()
    const navigate = useNavigate()

    const handleRequestSort = (event: React.MouseEvent<unknown>, sortOption: SortOption) => {
        const isAsc = sortOption === sortBy && sortDirection === SortDirection.ASC
        setSortDirection(isAsc ? SortDirection.DESC : SortDirection.ASC)
        setSortBy(sortOption)
    }

    const handleChangeShowPublished = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowPublished(event.target.checked)
    }

    const handleChangeShowNotPublished = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowNotPublished(event.target.checked)
    }

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const filteredTournaments = useMemo((): Tournament[] => {
        return filterTournaments(props.tournaments, showPublished, showNotPublished, search)
    }, [props.tournaments, showPublished, showNotPublished, search])

    const sortedTournaments = useMemo(() => {
        return filteredTournaments.slice().sort(getSortPredicate(sortBy, sortDirection))
    }, [filteredTournaments, sortDirection, sortBy])

    return <>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px"}}>
            <div>
                <TextField placeholder={"Søg efter turnering..."}
                           style={{ width: 400, marginRight: "32px" }}
                           InputProps={{startAdornment: <InputAdornment position={"start"}><Search/></InputAdornment>}}
                           onChange={handleChangeSearch}/>
                <FormControlLabel control={<Checkbox checked={showPublished} onChange={handleChangeShowPublished}/>}
                                  label={"Vis publicerede"}/>
                <FormControlLabel
                    control={<Checkbox checked={showNotPublished} onChange={handleChangeShowNotPublished}/>}
                    label={"Vis ikke-publicerede"}/>
            </div>
            <div>
                <Button color={"primary"} variant={"contained"}
                        onClick={() => navigate("create")}>
                    Opret turnering
                </Button>
            </div>
        </div>
        <Divider/>
        <TableContainer style={{maxHeight: "60vh", overflowX: "hidden"}}>
            <Table className={classes.table} stickyHeader>
                <colgroup>
                    <col style={{width: "40%"}}/>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "48px"}}/>
                </colgroup>
                <AdminTournamentsTableHead sortDirection={sortDirection} sortBy={sortBy}
                                           handleRequestSort={handleRequestSort}/>
                <TableBody>
                    {sortedTournaments.map(tournament => {
                            return <AdminTournamentRow tournament={tournament}/>
                        }
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}