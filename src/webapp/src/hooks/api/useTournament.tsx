import {
    GetTournamentRegistrationByPlayerDocument,
    Tournament,
    TournamentFormat,
    useCreateTournamentMutation,
    useGenerateBracketMutation,
    useGetAllTournamentsQuery,
    useGetTournamentByIdQuery,
    useRegisterTeamOrPlayerMutation
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
    const [registerTeamOrPlayerMutation] = useRegisterTeamOrPlayerMutation();

    const createTournament = (name: string, date: string, numberOfTeamsAllowed: number, format: TournamentFormat, picture: string, description: string, rules: string) => createTournamentMutation({
        variables: {
            name,
            date,
            numberOfTeamsAllowed,
            format,
            picture,
            description,
            rules
        },
    })

    const generateBracket = (tournamentId: number) => generateBracketMutation({
        variables: {
            tournamentId
        }
    })

    const registerTeamOrPlayer = (tournamentId: number, teamId: number, playerId: number) => registerTeamOrPlayerMutation({
        variables: {
            tournamentId,
            teamId,
            playerId
        },
        refetchQueries: [
            GetTournamentRegistrationByPlayerDocument
        ]
    })

    return {
        createTournament,
        generateBracket,
        registerTeamOrPlayer
    }
}