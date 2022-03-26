import {addDoc, collection, Firestore, getDocs, query, SnapshotOptions, where} from "firebase/firestore";
import {QueryDocumentSnapshot} from "@firebase/firestore";
import {StorageReference} from "firebase/storage";
import {useAuth} from "../authentication/AuthContext";
import {usePlayersCollection} from "./database";
import {Player} from "./PlayersHandler";

export interface Team {
    name: string;
    wins: number;
    losses: number;
    points: number;
    picture: string;
    playerIds: string[];
    createdTs: number,
}

interface TeamsHandlerProps {
    database: Firestore
    storage: (path: string) => StorageReference
}

export enum CreateTeamResponse {
    ERROR_NAME_EXISTS,
    NOT_LOGGED_IN,
    SUCCESS
}

export const teamConverter = {
    toFirestore: (team: Team) => {
        return team
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Team => {
        const data = snapshot.data(options)!;
        return {
            name: data.name,
            wins: data.wins,
            losses: data.losses,
            points: data.points,
            picture: data.picture,
            playerIds: data.playerIds,
            createdTs: data.createdTs
        };
    }
}

export const TeamsHandler = (props: TeamsHandlerProps) => {
    const db = props.database;
    const {currentUser} = useAuth();
    const playersDatabase = usePlayersCollection();

    const teamsCollectionRef = collection(db, "teams").withConverter(teamConverter);

    const getTeamByName = async (name: string): Promise<Team> => {
        const snap = await getDocs(query(teamsCollectionRef, where("name", "==", name)));
        const team = snap.docs[0].data();
        return team;
    }

    const getAllTeams = async (): Promise<Team[]> => {
        const snap = await getDocs(query(teamsCollectionRef));
        return snap.docs.map(team => {
            return team.data();
        })
    }

    const getTeamsById = async (teamIds: string[]): Promise<Team[]> => {
        const allTeamDocs = await getDocs(teamsCollectionRef);
        const teamDocs = allTeamDocs.docs.filter(doc => teamIds.includes(doc.id));
        return teamDocs.map(doc => doc.data());
    }

    const createTeam = async (name: string): Promise<CreateTeamResponse> => {
        if (!currentUser || !currentUser.uid) {
            return CreateTeamResponse.NOT_LOGGED_IN;
        }

        const teamQuery = query(teamsCollectionRef, where("name", "==", name));
        const teamDoc = await getDocs(teamQuery);
        if (!teamDoc.empty) {
            return CreateTeamResponse.ERROR_NAME_EXISTS;
        }
        const newTeamDoc = await addDoc(teamsCollectionRef, {
            name: name,
            wins: 0,
            losses: 0,
            points: 0,
            picture: "https://firebasestorage.googleapis.com/v0/b/cssundays.appspot.com/o/teamImages%2Fplaceholder.PNG?alt=media&token=9e14e62f-6563-4589-be4d-2bb7fab0713b",
            playerIds: [],
            createdTs: Date.now(),
        });
        await playersDatabase.addPlayerToTeam(newTeamDoc.id, currentUser.uid);
        return CreateTeamResponse.SUCCESS;
    }

    return {
        getTeamByName,
        getAllTeams,
        createTeam,
        getTeamsById,
    }
}