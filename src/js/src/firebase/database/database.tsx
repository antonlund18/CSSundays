import {TeamsHandler} from "./TeamsHandler";
import {getFirestore} from "firebase/firestore";
import {app} from "../FirebaseInitializer";
import {getStorage, ref} from "firebase/storage";
import {PlayersHandler} from "./PlayersHandler";

const db = getFirestore(app);
const storage = getStorage();
const storageRef = (path: string) => {return ref(storage, path)};

export const usePlayersCollection = () => {
    return PlayersHandler({database: db, storage: storageRef});
};

export const useTeamsCollection = () => {
    return TeamsHandler({database: db, storage: storageRef});
};