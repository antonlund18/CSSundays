import {Constants} from "../../util/Constants";
import {
    useCreateUserMutation,
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
    useLoginUserMutation,
    User,
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
            window.location.reload();
        })
    }

    const logOutUser = () => {
        localStorage.removeItem(Constants.JWT_TOKEN);
        window.location.reload();
    }

    return {
        createUser,
        loginUser,
        logOutUser,
    }
}