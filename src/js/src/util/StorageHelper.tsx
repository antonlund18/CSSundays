import {ObjectType} from "../codegen/generated-types";

const S3_PUBLIC_PICTURES_URL = "https://cssundays-public-pictures.s3.amazonaws.com"
const TEAMS_FOLDER = "teams"
const USERS_FOLDER = "users"

export const getPictureLinkFromKey = (pictureKey: string, objectType: ObjectType) => {
    switch (objectType) {
        case ObjectType.User:
            return `${S3_PUBLIC_PICTURES_URL}/${USERS_FOLDER}/${pictureKey}`;
        case ObjectType.Team:
            return `${S3_PUBLIC_PICTURES_URL}/${TEAMS_FOLDER}/${pictureKey}`;
        default:
            return "";
    }
}