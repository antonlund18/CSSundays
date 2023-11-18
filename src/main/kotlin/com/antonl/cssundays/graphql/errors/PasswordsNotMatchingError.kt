package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class PasswordsNotMatchingError : CssundaysGraphQLError {
    override fun getErrorCode(): Int {
        return ErrorTypes.PASSWORDS_NOT_MATCHING.errorCode
    }

    override fun getMessage(): String {
        return "Passwords does not match"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.PASSWORDS_NOT_MATCHING
    }

}