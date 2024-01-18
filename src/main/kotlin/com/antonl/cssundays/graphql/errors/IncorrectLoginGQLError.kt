package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class IncorrectLoginGQLError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Incorrect login"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.INCORRECT_LOGIN
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.INCORRECT_LOGIN.errorCode
    }
}