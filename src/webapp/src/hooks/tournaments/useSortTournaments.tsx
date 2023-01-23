import {SortDirection, SortOption} from "../../pages/tournamentpage/AdminTournamentsTable";
import {Tournament} from "../../codegen/generated-types";

export const useSortTournaments = () => {
    const sortByPublishedPredicate = (direction: SortDirection) => {
     return (t1: Tournament, t2: Tournament): number => {
            if (t1.published === t2.published) return 0
            if (t1.published && !t2.published) return direction === SortDirection.ASC ? 1 : -1
            return direction === SortDirection.ASC ? -1 : 1
        }
    }

    const sortByNamePredicate = (direction: SortDirection) => {
        return (t1: Tournament, t2: Tournament): number => {
            if (direction === SortDirection.ASC) return t1.name.toLowerCase() < t2.name.toLowerCase() ? 1 : -1
            return t1.name.toLowerCase() < t2.name.toLowerCase() ? -1 : 1
        }
    }

    const sortByCreatedTsPredicate = (direction: SortDirection) => {
        return (t1: Tournament, t2: Tournament): number => {
            return direction === SortDirection.ASC ? Date.parse(t1.createdTs) - Date.parse(t2.createdTs) : Date.parse(t2.createdTs) - Date.parse(t1.createdTs)
        }
    }

    const sortByStartTsPredicate = (direction: SortDirection) => {
        return (t1: Tournament, t2: Tournament): number => {
            return direction === SortDirection.ASC ? Date.parse(t1.date) - Date.parse(t2.date) : Date.parse(t2.date) - Date.parse(t1.date)
        }
    }

    const getSortPredicate = (sortBy: SortOption, direction: SortDirection) => {
        switch (sortBy) {
            case SortOption.PUBLISHED:
                return sortByPublishedPredicate(direction)
            case SortOption.NAME:
                return sortByNamePredicate(direction)
            case SortOption.CREATED:
                return sortByCreatedTsPredicate(direction)
            case SortOption.START:
                return sortByStartTsPredicate(direction)
        }
    }

    return getSortPredicate
}