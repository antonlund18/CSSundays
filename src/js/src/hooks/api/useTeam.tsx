import {
    Team,
    useCreateTeamMutation,
    useGetAllTeamsQuery,
    useGetTeamByIdQuery,
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
        team: data?.getTeamById,
        loading
    }
}

export const useMutateTeam = () => {
    const [createTeamMutation] = useCreateTeamMutation();
    const [incrementWinsMutation] = useIncrementWinsMutation();

    const createTeam = (name: string, ownerId: number) => {
        return createTeamMutation({
            variables: {
                name,
                ownerId
            }
        });
    }

    const incrementWins = (teamId: number) => {
        return incrementWinsMutation({variables: {teamId}})
    }

    return {
        createTeam,
        incrementWins
    }
}