import {
    GetCurrentUserDocument,
    GetTeamByIdDocument,
    GetUserByIdDocument,
    ObjectType,
    useSetPictureAndGetPresignedRequestMutation
} from "../../codegen/generated-types";
import {client} from "../../ApolloClientProvider";
import {useContext} from "react";
import {SnackbarContext} from "../../SnackbarContextProvider";

export const useSharedTeamAndUser = () => {
    const [setPictureAndGetPresignedRequestMutation] = useSetPictureAndGetPresignedRequestMutation();
    const {openSnackbar} = useContext(SnackbarContext)

    const setAndUploadPicture = async (id: number, selector: HTMLInputElement | null, objectType: ObjectType, showSnackbar: boolean = true) => {
        if (!selector) return;

        const file = selector.files?.item(0);
        if (!file) return;

        const buffer = await file?.arrayBuffer();
        const byteArray = new Int8Array(buffer);

        setPictureAndGetPresignedRequestMutation({
            variables: {
                id,
                objectType
            },
        }).then(async (data) => {
            const request = data.data?.setPictureAndGetPresignedRequest;
            if (!request) return;

            const headers: any = {};
            request.headers.forEach(header => {
                headers[header.name] = header.value
            })

            const requestOptions: { method: string, headers: any, body: any } = {
                method: request.method,
                headers: headers,
                body: byteArray,
            }

            await fetch(new URL("http://" + request.url).toString(), requestOptions).then(() => {
                switch (objectType) {
                    case ObjectType.User:
                        client.refetchQueries({
                            include: [GetUserByIdDocument, GetCurrentUserDocument]
                        })
                        break
                    case ObjectType.Team:
                        client.refetchQueries({
                            include: [GetTeamByIdDocument]
                        })
                        break
                    case ObjectType.Tournament:
                        break
                    default:
                        break
                }
                if (showSnackbar) {
                    openSnackbar("Billede opdateret", "success")
                }
            })
        }).catch((e) => {
            console.log(e);
        })
    }

    return {
        setAndUploadPicture
    }
}
