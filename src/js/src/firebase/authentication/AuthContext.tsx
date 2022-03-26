import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User, Auth} from "firebase/auth";
import {app} from "../FirebaseInitializer";

interface AuthContextInterface {
    auth: Auth | null
    currentUser: User | null,
    signup: (email: string, password: string) => Promise<any>,
    login: (email: string, password: string) => Promise<any>,
    logout: () => void,
}

const AuthContextDefaults: AuthContextInterface = {
    auth: null,
    currentUser: null,
    signup: () => new Promise((res, req) => {}),
    login: () => new Promise((res, req) => {}),
    logout: () => null,
}

export const AuthContext = createContext<AuthContextInterface>(AuthContextDefaults);

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = (props: React.PropsWithChildren<any>): JSX.Element => {
    const auth = getAuth(app);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        })
        return unsubscribe;
    }, [])


    const signup = (email: string, password: string): Promise<any> => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email: string, password: string): Promise<any> => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        return auth.signOut();
    }

    const value = {
        auth,
        currentUser,
        login,
        logout,
        signup
    };

    return <AuthContext.Provider value={value}>
        {props.children}
    </AuthContext.Provider>
}