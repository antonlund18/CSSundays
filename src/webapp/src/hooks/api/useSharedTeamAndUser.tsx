import {ObjectType, useSetPictureAndGetPresignedRequestMutation} from "../../codegen/generated-types";

export const useSharedTeamAndUser = () => {
    const [setPictureAndGetPresignedRequestMutation] = useSetPictureAndGetPresignedRequestMutation();

    const setAndUploadPicture = async (id: number, selector: HTMLInputElement, objectType: ObjectType) => {
        const file = selector?.files?.item(0);
        if (!file) return;

        const buffer = await file?.arrayBuffer();
        const byteArray = new Int8Array(buffer);

        setPictureAndGetPresignedRequestMutation({
            variables: {
                id,
                objectType
            }
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

            await fetch(new URL("http://" + request.url).toString(), requestOptions).then(() => window.location.reload());
        }).catch((e) => {
            console.log(e);
        })
    }

    return {
        setAndUploadPicture
    }
}
