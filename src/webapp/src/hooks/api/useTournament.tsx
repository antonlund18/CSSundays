import {Tournament, useCreateTournamentMutation, useGetAllTournamentsQuery} from "../../codegen/generated-types";

export const useGetAllTournaments = () => {
    const {data, loading} = useGetAllTournamentsQuery();
    return {
        tournaments: data?.getAllTournaments as Tournament[],
        loading
    }
}

export const useTournaments = () => {
    const [createTournamentMutation] = useCreateTournamentMutation();

    const createTournament = (name: string, date: string, numberOfTeamsAllowed: number) => createTournamentMutation({
        variables: {
            name,
            date,
            numberOfTeamsAllowed
        },
    })

    return {
        createTournament
    }
}