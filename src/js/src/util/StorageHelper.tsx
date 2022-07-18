const S3_PLAYER_DIRECTORY_PATH = "https://cssundays-public-pictures.s3.amazonaws.com/users/"

export const getPictureLinkFromKey = (pictureKey: string) => {
    return S3_PLAYER_DIRECTORY_PATH + pictureKey;
}