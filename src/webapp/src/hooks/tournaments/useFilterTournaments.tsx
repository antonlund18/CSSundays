import {Tournament} from "../../codegen/generated-types";

export const useFilterTournaments = () => {
    return (tournaments: Tournament[], showPublished: boolean, showNotPublished: boolean, search: string): Tournament[] => {

        const filterPublishedIfEnabled = (tournament: Tournament) => {
            if (!showPublished) return !tournament.published
            return true
        }

        const filterNotPublishedIfEnabled = (tournament: Tournament) => {
            if (!showNotPublished) return tournament.published
            return true
        }

        const filterSearch = (tournament: Tournament) => {
            return tournament.name.toLowerCase().includes(search.trim().toLowerCase())
        }

        return tournaments.filter(filterPublishedIfEnabled).filter(filterNotPublishedIfEnabled).filter(filterSearch)
    }
}