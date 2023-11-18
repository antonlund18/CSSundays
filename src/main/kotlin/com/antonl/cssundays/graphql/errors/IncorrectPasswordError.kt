package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class IncorrectPasswordError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Incorrect password"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.INCORRECT_PASSWORD
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.INCORRECT_PASSWORD.errorCode
    }
}