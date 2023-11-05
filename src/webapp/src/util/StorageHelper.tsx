import {ObjectType} from "../codegen/generated-types";

const S3_PUBLIC_PICTURES_URL = "https://cssundays-public-images.s3.amazonaws.com"
const TEAMS_FOLDER = "teams"
const USERS_FOLDER = "users"
const TOURNAMENTS_FOLDER = "tournaments"

const DEFAULT_PLAYER_PROFILE_PICTURE = "default_player_profile_picture.png";
const DEFAULT_TEAM_PICTURE = "default_team_picture.png";

export const getPictureLinkFromKey = (pictureKey: string | null, objectType: ObjectType) => {
    switch (objectType) {
        case ObjectType.User:
            if (!pictureKey) return `${S3_PUBLIC_PICTURES_URL}/${USERS_FOLDER}/${DEFAULT_PLAYER_PROFILE_PICTURE}`
            return `${S3_PUBLIC_PICTURES_URL}/${USERS_FOLDER}/${pictureKey}`;
        case ObjectType.Team:
            if (!pictureKey) return `${S3_PUBLIC_PICTURES_URL}/${TEAMS_FOLDER}/${DEFAULT_TEAM_PICTURE}`
            return `${S3_PUBLIC_PICTURES_URL}/${TEAMS_FOLDER}/${pictureKey}`;
        case ObjectType.Tournament:
            if (!pictureKey) return `${S3_PUBLIC_PICTURES_URL}/${TOURNAMENTS_FOLDER}/${DEFAULT_TEAM_PICTURE}`
            return `${S3_PUBLIC_PICTURES_URL}/${TOURNAMENTS_FOLDER}/${pictureKey}`;
        default:
            return "";
    }
}