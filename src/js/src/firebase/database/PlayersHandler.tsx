import {QueryDocumentSnapshot} from "@firebase/firestore";
import {
    collection,
    doc,
    Firestore,
    getDoc,
    getDocs,
    query,
    setDoc,
    SnapshotOptions,
    updateDoc,
    where
} from "firebase/firestore";
import {teamConverter} from "./TeamsHandler";
import {getDownloadURL, ref, StorageReference, uploadBytes} from "firebase/storage";

export interface Player {
    username: string;
    email: string;
    createdTs: number;
    picture: string;
    teamIds: string[];
}

interface PlayersHandlerProps {
    database: Firestore
    storage: (path: string) => StorageReference
}

export enum CreatePlayerResponse {
    USER_DOES_NOT_EXIST,
    USERNAME_IN_USE,
    SUCCESS,

}

export const PlayersHandler = (props: PlayersHandlerProps) => {
    const db = props.database;

    const playerConverter = {
        toFirestore: (player: Player) => {
            return player;
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Player => {
            const data = snapshot.data(options)!;
            return {
                username: data.username,
                email: data.email,
                createdTs: data.createdTs,
                picture: data.picture,
                teamIds: data.teamIds,
            };
        }
    }

    const playersCollectionRef = collection(db, "players").withConverter(playerConverter);

    const createPlayer = async (userId: string, email: string, username: string): Promise<CreatePlayerResponse> => {
        const playerQuery = query(playersCollectionRef, where("username", "==", username));
        const playerDoc = await getDocs(playerQuery);
        if (!playerDoc.empty) {
            return CreatePlayerResponse.USERNAME_IN_USE;
        }
        await setDoc(doc(db, "players", userId), {
            username: username,
            email: email,
            createdTs: Date.now(),
            picture: "https://firebasestorage.googleapis.com/v0/b/cssundays.appspot.com/o/playerImages%2Fplaceholder.PNG?alt=media&token=bf5a6b73-694b-44f5-86f0-5d457a9ddc32",
            teamIds: [],
        });

        return CreatePlayerResponse.SUCCESS;
    }

    const addPlayerToTeam = async (teamId: string, playerId: string) => {
        const teamRef = doc(db, "teams/" + teamId).withConverter(teamConverter);
        const teamDoc = await getDoc(teamRef);
        if (teamDoc.exists()) {
            await updateDoc(teamRef, {playerIds: [...teamDoc.data().playerIds, playerId]})
        }

        const playerRef = doc(db, "players/" + playerId).withConverter(playerConverter);
        const playerDoc = await getDoc(playerRef);
        if (playerDoc.exists()) {
            await updateDoc(playerRef, {teamIds: [...playerDoc.data().teamIds, teamId]})
        }
    }

    const getPlayerById = async (userId: string): Promise<Player | null> => {
        const playerDoc = await getDoc(doc(db, "players", userId).withConverter(playerConverter));
        if (playerDoc.exists()) {
            return playerDoc.data();
        }
        return null;
    }

    const getPlayersById = async (playerIds: string[]): Promise<Player[]> => {
        const allPlayerDocs = await getDocs(playersCollectionRef);
        const playerDocs = allPlayerDocs.docs.filter(doc => playerIds.includes(doc.id));
        return playerDocs.map(doc => doc.data());
    }

    const getPlayerByUsername = async (username: string): Promise<Player | undefined> => {
        const playerQuery = query(playersCollectionRef, where("username", "==", username));
        const playerDoc = await getDocs(playerQuery);
        if (!playerDoc.empty) {
            return playerDoc.docs[0].data();
        }
    }


    const uploadImage = async (playerId: string, selector: HTMLInputElement): Promise<void> => {
        if (!selector.files || selector.files.length === 0) {
            return;
        }
        const file = selector.files[0];
        const imageRef = ref(props.storage("playerImages/" + playerId));
        await uploadBytes(imageRef, file).catch(error => console.log(error));
        await setPlayerPicture(playerId).catch(error => console.log(error));
    }

    const setPlayerPicture = async (playerId: string): Promise<void> => {
        const playerDoc = doc(db, "players/" + playerId);
        const player = await getDoc(playerDoc).then(doc => doc.data());
        if (!player) {
            return;
        }
        const pictureURL = await getDownloadURL(props.storage("playerImages/" + playerId))
        await updateDoc(playerDoc, {picture: pictureURL});
    }

    return {
        createPlayer,
        addPlayerToTeam,
        getPlayerById,
        getPlayerByUsername,
        uploadImage,
        getPlayersById,
    }
}