import {
    FindAllInvitesForPlayerDocument,
    FindAllInvitesForPlayerQuery,
    useAcceptInvitationMutation,
    useCreateInviteToTeamMutation,
    useDeclineInvitationMutation,
    useFindAllInvitesForPlayerQuery,
    useFindAllUnseenInvitesForPlayerQuery,
    useFindPendingInvitesForPlayerQuery
} from "../../codegen/generated-types";

export const useFindPendingInvitesForPlayer = (playerId: number) => {
    const {data} = useFindPendingInvitesForPlayerQuery({
        variables: {
            playerId: playerId
        }
    })

    return {
        pendingInvitesForPlayer: data?.findPendingInvitesForPlayer
    }
}

export const useFindAllInvitesForPlayer = (playerId: number) => {
    const {data} = useFindAllInvitesForPlayerQuery({
        variables: {
            playerId: playerId
        }
    })

    return {
        allInvitesForPlayer: data?.findAllInvitesForPlayer
    }
}

export const useFindAllUnseenInvitesForPlayer = (playerId: number) => {
    const {data} = useFindAllUnseenInvitesForPlayerQuery({
        variables: {
            playerId: playerId
        }
    })

    return {
        allUnseenInvitesForPlayer: data?.findAllUnseenInvitesForPlayer
    }
}

export const useInviteToTeamMutation = () => {
    const [createInviteToTeamMutation] = useCreateInviteToTeamMutation();
    const [acceptInvitationMutation] = useAcceptInvitationMutation();
    const [declineInvitationMutation] = useDeclineInvitationMutation();

    const createInviteToTeam = (playerId: number, teamId: number, senderId: number) => {
        return createInviteToTeamMutation({
            variables: {
                playerId,
                teamId,
                senderId
            },
            update(cache, {data}) {
                const findAllInvitesQueryOptions = {
                    query: FindAllInvitesForPlayerDocument,
                    variables: {playerId: playerId}
                }
                const invites = cache.readQuery<FindAllInvitesForPlayerQuery>(findAllInvitesQueryOptions)?.findAllInvitesForPlayer
                if (invites) {
                    cache.writeQuery({
                        ...findAllInvitesQueryOptions,
                        data: {
                            findAllInvitesForPlayer: [...invites, data?.createInviteToTeam]
                        }
                    })
                }
            }
        })
    }

    const acceptInvitation = (invitationId: number) => {
        return acceptInvitationMutation({
            variables: {
                id: invitationId
            }
        })
    }

    const declineInvitation = (invitationId: number) => {
        return declineInvitationMutation({
            variables: {
                id: invitationId
            }
        })
    }

    return {
        createInviteToTeam,
        acceptInvitation,
        declineInvitation
    }
}