package com.antonl.cssundays.graphql.validation.validators

abstract class Validator {
    fun validate(input: UserMutationInput, errors: MutableList<Error>) {
        if (hasError(input)) {
            errors.add(getError())
        }
    }

    abstract fun hasError(input: UserMutationInput): Boolean

    abstract fun getError(): Error
}

enum class Error {
    INVALID_EMAIL,
    EMAIL_IN_USE,
    USER_NOT_FOUND,
    INVALID_PLAYERTAG,
    PLAYERTAG_IN_USE,
    INVALID_PASSWORD,
    PASSWORDS_NOT_MATCHING,
}