import {
    GetCurrentUserDocument,
    Team,
    useCreateTeamMutation,
    useGetAllTeamsQuery,
    useGetTeamByIdQuery,
    useIncrementLossesMutation,
    useIncrementWinsMutation
} from "../../codegen/generated-types";

export const useGetAllTeams = () => {
    const {data, loading} = useGetAllTeamsQuery();
    return {
        teams: data?.getAllTeams as Team[],
        loading
    }
}

export const useGetTeamById = (id: number) => {
    const {data, loading} = useGetTeamByIdQuery({variables: {teamId: id}});
    return {
        team: data?.getTeamById as Team,
        loading
    }
}

export const useMutateTeam = () => {
    const [createTeamMutation] = useCreateTeamMutation();
    const [incrementWinsMutation] = useIncrementWinsMutation();
    const [incrementLossesMutation] = useIncrementLossesMutation();

    const createTeam = (name: string, ownerId: number) => {
        return createTeamMutation({
            variables: {
                name,
                ownerId
            },
            refetchQueries: [
                GetCurrentUserDocument
            ]
        });
    }

    const incrementWins = (teamId: number) => {
        return incrementWinsMutation({variables: {teamId}})
    }

    const incrementLosses = (teamId: number) => {
        return incrementLossesMutation({variables: {teamId}})
    }

    return {
        createTeam,
        incrementWins,
        incrementLosses
    }
}