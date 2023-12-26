import {
    FindTournamentRegistrationByPlayerDocument,
    Tournament,
    TournamentFormat,
    useCreateTournamentMutation,
    useGenerateBracketMutation,
    useGetAllTournamentsQuery,
    useGetTournamentByIdQuery,
    useRegisterTeamMutation
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

    const registerTeam = (tournamentId: number, teamId: number, captainId: number) => registerTeamMutation({
        variables: {
            tournamentId,
            teamId,
            captainId
        },
        refetchQueries: [
            FindTournamentRegistrationByPlayerDocument
        ]
    })

    return {
        createTournament,
        generateBracket,
        registerTeam
    }
}