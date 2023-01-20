import {
    Notification,
    useGetAllNotificationsQuery, useMarkAllNotificationsAsSeenForUserMutation
} from "../../codegen/generated-types";
import {gql} from "@apollo/client";

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

export const useNotifications = () => {
    const [markAllNotificationsAsSeenForUserMutation] = useMarkAllNotificationsAsSeenForUserMutation();

    const markAllNotificationsAsSeenForUser = (userId: number) => markAllNotificationsAsSeenForUserMutation({
        variables: {
            userId
        },
        update(cache, data) {
         cache.modify({
             fields: {
                 notifications() {
                     cache.writeFragment({
                         data: data,
                         fragment: gql`
                             fragment NewNotification on Notification {
                                 id,
                                 isSeen
                             }
                         `
                     })
                 }
             }
         })
        }
    })

    return {
        markAllNotificationsAsSeenForUser
    }
}