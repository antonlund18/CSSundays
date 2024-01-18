package com.antonl.cssundays.graphql.errors

import com.antonl.cssundays.model.errors.Error

class GQLErrorMapper {
    companion object {
        fun getGQLError(error: Error): CssundaysGraphQLError {
            when (error) {
                Error.USER_NOT_FOUND -> {
                    return UserNotFoundGQLError()
                }
                Error.INVALID_PASSWORD -> {
                    return InvalidPasswordGQLError()
                }
                Error.PASSWORDS_NOT_MATCHING -> {
                    return PasswordsNotMatchingGQLError()
                }
                Error.INVALID_EMAIL -> {
                    return InvalidEmailGQLError()
                }
                Error.EMAIL_IN_USE -> {
                    return EmailInUseGQLError()
                }
                Error.INVALID_PLAYERTAG -> {
                    return InvalidPlayertagGQLError()
                }
                Error.PLAYERTAG_IN_USE -> {
                    return PlayertagInUseGQLError()
                }
                Error.INCORRECT_PASSWORD -> {
                    return IncorrectPasswordGQLError()
                }
                Error.INCORRECT_LOGIN -> {
                    return IncorrectLoginGQLError()
                }
            }
        }
    }
}