package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class InternalErrorGQL : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Internal error"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.INTERNAL_ERROR
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.INTERNAL_ERROR.errorCode
    }
}