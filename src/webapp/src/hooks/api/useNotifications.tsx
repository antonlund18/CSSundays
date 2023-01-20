import {
    useGetAllNotificationsQuery
} from "../../codegen/generated-types";

export const useFindAllNotificationsForPlayer = (playerId: number) => {
    const {data} = useGetAllNotificationsQuery({
        variables: {
            userId: playerId
        }
    })

    return {
        allNotificationsForPlayer: data?.getAllNotifications
    }
}