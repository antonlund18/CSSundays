import {TournamentRegistration} from "../codegen/generated-types";
import {SortDirection, SortOption} from "../components/SortTypes";

export type TournamentRegistrationEntry = {
    registration: TournamentRegistration
    number: number
}

export const useTournamentRegistrationSort = () => {
    const sortByNamePredicate = (direction: SortDirection) => {
        return (t1: TournamentRegistrationEntry, t2: TournamentRegistrationEntry): number => {
            if (direction === SortDirection.ASC) return t1.registration.team.name.toLowerCase() < t2.registration.team.name.toLowerCase() ? 1 : -1
            return t1.registration.team.name.toLowerCase() < t2.registration.team.name.toLowerCase() ? -1 : 1
        }
    }

    const sortByNumberPredicate = (direction: SortDirection) => {
        return (t1: TournamentRegistrationEntry, t2: TournamentRegistrationEntry): number => {
            return direction === SortDirection.ASC ? t1.number - t2.number : t2.number - t1.number
        }
    }

    const getSortPredicate = (sortBy: SortOption, direction: SortDirection) => {
        switch (sortBy) {
            case SortOption.NAME:
                return sortByNamePredicate(direction)
            case SortOption.NUMBER:
                return sortByNumberPredicate(direction)
            default:
                return sortByNamePredicate(direction)
        }
    }

    return getSortPredicate
}