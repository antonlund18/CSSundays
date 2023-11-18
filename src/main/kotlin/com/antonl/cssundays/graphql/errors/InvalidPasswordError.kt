package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class InvalidPasswordError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Invalid password"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.INVALID_PASSWORD
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.INVALID_PASSWORD.errorCode
    }
}