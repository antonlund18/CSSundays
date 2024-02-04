import {Constants} from "../../util/Constants";
import {
    EditUserInput,
    useCreateUserMutation,
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
    useLoginUserMutation,
    User,
    useUpdateUserMutation,
} from "../../codegen/generated-types";

export const useGetCurrentUser = (): { currentUser: User | null, isLoggedIn: boolean } => {
    const token = localStorage.getItem(Constants.JWT_TOKEN);
    const {data} = useGetCurrentUserQuery({
        variables: {
            token: token ?? ""
        },
    })
    const isLoggedIn = data !== null;
    return {
        currentUser: data?.getCurrentUser ? data?.getCurrentUser as User : null,
        isLoggedIn
    }
}

export const useGetUserById = (id: number) => {
    const {data, loading} = useGetUserByIdQuery({
        variables: {
            id
        }
    })
    return {
        user: data?.getUserById as User,
        loading
    }
}

export const useMutateUser = () => {
    const [createUserMutation] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation()

    const createUser = (playertag: string, email: string, password: string, passwordRepeated: string) => {
        return createUserMutation({
            variables: {
                playertag,
                email,
                password,
                passwordRepeated
            }
        }).then((data) => {
            localStorage.setItem(Constants.JWT_TOKEN, data.data?.createUser ?? "");
        })
    }

    const editUser = (editUserInput: EditUserInput) => {
        return updateUser({variables: {editUserInput: editUserInput}})
    }

    const logOutUser = () => {
        localStorage.removeItem(Constants.JWT_TOKEN);
        window.location.reload();
    }

    return {
        createUser,
        editUser,
        logOutUser,
    }
}