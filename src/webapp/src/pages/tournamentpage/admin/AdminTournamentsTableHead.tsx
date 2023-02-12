import {TableCell, TableHead, TableRow, TableSortLabel, Typography} from "@material-ui/core";
import {SortDirection, SortOption} from "../../../hooks/tournaments/useSortTournaments";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    sortOption?: SortOption
    numeric: boolean;
}

interface AdminTournamentsTableHeadProps {
    sortDirection: SortDirection,
    sortBy: SortOption
    handleRequestSort: (event: React.MouseEvent<unknown>, sortOption: SortOption) => void
}

export const AdminTournamentsTableHead = (props: AdminTournamentsTableHeadProps): JSX.Element => {
    const {sortDirection, sortBy, handleRequestSort} = props

    const createSortHandler = (sortOption?: SortOption) => (event: React.MouseEvent<unknown>) => {
        if (sortOption) handleRequestSort(event, sortOption)
        return () => null
    }

    const headCells: HeadCell[] = [
        {
            id: "name",
            sortOption: SortOption.NAME,
            numeric: false,
            disablePadding: false,
            label: 'Navn',
        },
        {
            id: "published",
            sortOption: SortOption.PUBLISHED,
            numeric: false,
            disablePadding: false,
            label: 'Publiceret',
        },
        {
            id: "start",
            sortOption: SortOption.START,
            numeric: true,
            disablePadding: false,
            label: 'Start',
        },
        {
            id: "createdTs",
            sortOption: SortOption.CREATED,
            numeric: true,
            disablePadding: false,
            label: 'Oprettet',
        },
        {
            id: 'edit',
            numeric: true,
            disablePadding: false,
            label: '',
        }
    ]

    return <TableHead>
        <TableRow>
            {headCells.map(headCell => {
                    return <TableCell key={headCell.id}
                                      align={headCell.numeric ? "right" : "left"}
                                      padding={headCell.disablePadding ? "none" : "normal"}
                                      sortDirection={sortBy === headCell.sortOption ? sortDirection : false}>
                        <TableSortLabel active={sortBy === headCell.sortOption}
                                        direction={sortBy === headCell.sortOption ? sortDirection : SortDirection.ASC}
                                        onClick={createSortHandler(headCell.sortOption)}>
                            <Typography variant={"button"}>{headCell.label}</Typography>
                        </TableSortLabel>
                    </TableCell>
                }
            )}
        </TableRow>
    </TableHead>
}