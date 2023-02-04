import {
    Tournament,
    useCreateTournamentMutation,
    useGenerateBracketMutation,
    useGetAllTournamentsQuery, useGetTournamentByIdQuery, useRegisterTeamMutation
} from "../../codegen/generated-types";

export const useGetAllTournaments = () => {
    const {data, loading} = useGetAllTournamentsQuery();
    return {
        tournaments: data?.getAllTournaments as Tournament[],
        loading
    }
}

export const useGetTournamentById = (id: number) => {
    const {data, loading} = useGetTournamentByIdQuery({
        variables: {
            id
        }
    });
    return {
        tournament: data?.getTournamentById as Tournament,
        loading
    }
}

export const useTournaments = () => {
    const [createTournamentMutation] = useCreateTournamentMutation();
    const [generateBracketMutation] = useGenerateBracketMutation();
    const [registerTeamMutation] = useRegisterTeamMutation();

    const createTournament = (name: string, date: string, numberOfTeamsAllowed: number) => createTournamentMutation({
        variables: {
            name,
            date,
            numberOfTeamsAllowed
        },
    })

    const generateBracket = (tournamentId: number) => generateBracketMutation({
        variables: {
            tournamentId
        }
    })

    const registerTeam = (tournamentId: number, teamId: number) => registerTeamMutation({
        variables: {
            tournamentId,
            teamId
        }
    })

    return {
        createTournament,
        generateBracket,
        registerTeam
    }
}