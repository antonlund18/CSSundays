package com.antonl.cssundays.model.errors

enum class Error {
    // Validation
    INVALID_EMAIL,
    INVALID_PLAYERTAG,
    INVALID_PASSWORD,
    PASSWORDS_NOT_MATCHING,

    // Not found,
    USER_NOT_FOUND,

    // In use
    PLAYERTAG_IN_USE,
    EMAIL_IN_USE,

    // Authorization
    INCORRECT_PASSWORD,
    INCORRECT_LOGIN,
}