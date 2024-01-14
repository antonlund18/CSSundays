package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class InvalidEmailGQLError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Invalid e-mail"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.INVALID_EMAIL
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.INVALID_EMAIL.errorCode
    }
}