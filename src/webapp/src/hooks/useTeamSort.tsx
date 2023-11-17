import {SortDirection} from "../components/SortTypes";
import {Team} from "../codegen/generated-types";

export const useTeamSort = () => {
    const sortByNamePredicate = (direction: SortDirection) => {
        return (t1: Team, t2: Team): number => {
            if (direction === SortDirection.ASC) return t1.name.toLowerCase() < t2.name.toLowerCase() ? 1 : -1
            return t1.name.toLowerCase() < t2.name.toLowerCase() ? -1 : 1
        }
    }

    const getSortPredicate = (direction: SortDirection) => {
        return sortByNamePredicate(direction)
    }

    return getSortPredicate
}