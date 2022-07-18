import {Constants} from "../../util/Constants";
import {
    useCreateUserMutation,
    useGetCurrentUserQuery, useGetUserByIdQuery,
    useLoginUserMutation,
    User,
    useSetPictureAndGetPresignedRequestMutation
} from "../../codegen/generated-types";

export const useGetCurrentUser = (): { currentUser: User, isLoggedIn: boolean } => {
    const token = localStorage.getItem(Constants.JWT_TOKEN);
    const {data} = useGetCurrentUserQuery({
        variables: {
            token: token ?? ""
        }
    })
    const isLoggedIn = data !== null;
    return {
        currentUser: data?.getCurrentUser as User,
        isLoggedIn
    }
}

export const useGetUserById = (id: number) => {
    const {data} = useGetUserByIdQuery({
        variables: {
            id
        }
    })
    return {
        user: data?.getUserById as User
    }
}

export const useMutateUser = () => {
    const [createUserMutation] = useCreateUserMutation();
    const [loginUserMutation] = useLoginUserMutation();
    const [setPictureAndGetPresignedRequestMutation] = useSetPictureAndGetPresignedRequestMutation();

    const createUser = (playertag: string, email: string, password: string) => {
        return createUserMutation({
            variables: {
                playertag,
                email,
                password
            }
        }).then((data) => {
            localStorage.setItem(Constants.JWT_TOKEN, data.data?.createUser ?? "");
        })
    }

    const loginUser = (email: string, password: string) => {
        return loginUserMutation({
            variables: {
                email,
                password
            }
        }).then((data) => {
            localStorage.setItem(Constants.JWT_TOKEN, data.data?.loginUser ?? "");
        })
    }

    const logOutUser = () => {
        localStorage.removeItem(Constants.JWT_TOKEN);
    }

    const uploadUserPicture = async (userId: number, selector: HTMLInputElement) => {
        const file = selector?.files?.item(0);
        if (!file) return;

        const buffer = await file?.arrayBuffer();
        const byteArray = new Int8Array(buffer);

        setPictureAndGetPresignedRequestMutation({
            variables: {
                userId,
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
        createUser,
        loginUser,
        logOutUser,
        uploadUserPicture
    }
}