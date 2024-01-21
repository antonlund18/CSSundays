import {
    FindAllInvitesForPlayerDocument,
    FindPendingInvitesForPlayerDocument,
    GetUserByIdDocument,
    useAcceptInvitationMutation,
    useCreateInviteToTeamMutation,
    useDeclineInvitationMutation,
    useFindAllInvitesForPlayerQuery,
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

export const useInviteToTeamMutation = () => {
    const [createInviteToTeamMutation] = useCreateInviteToTeamMutation()
    const [acceptInvitationMutation] = useAcceptInvitationMutation();
    const [declineInvitationMutation] = useDeclineInvitationMutation();

    const createInviteToTeam = (recipientId: number, teamId: number, senderId: number) => createInviteToTeamMutation({
        variables: {
            senderId,
            teamId,
            recipientId
        },
        refetchQueries: [
            FindAllInvitesForPlayerDocument
        ]
    })

    const acceptInvitation = (invitationId: number) => {
        return acceptInvitationMutation({
            variables: {
                id: invitationId
            },
            refetchQueries: [
                GetUserByIdDocument,
                FindPendingInvitesForPlayerDocument
            ]
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