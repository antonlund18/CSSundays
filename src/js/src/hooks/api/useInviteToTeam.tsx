import {useFindPendingInvitesForPlayerQuery} from "../../codegen/generated-types";

export const useFindPendingInvitesForPlayer = (playerId: number) => {
    const {data} = useFindPendingInvitesForPlayerQuery({
        variables: {
            playerId: playerId
        }
    })

    return data?.findPendingInvitesForPlayer;
}