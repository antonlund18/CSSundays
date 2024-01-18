// 1 - 100: Errors from input validation in frontend
// 101 - 200: Errors from backend responses

export enum Errors {
    USER_NOT_FOUND = 101,
    INCORRECT_PASSWORD = 102,
    INVALID_PASSWORD = 103,
    PASSWORDS_NOT_MATCHING = 104,
    INVALID_EMAIL = 105,
    EMAIL_IN_USE = 106,
    INVALID_PLAYERTAG = 107,
    PLAYERTAG_IN_USE = 108,
    INCORRECT_LOGIN = 109,
}