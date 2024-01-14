package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class InvalidPlayertagGQLError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Invalid playertag"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.INVALID_PLAYERTAG
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.INVALID_PLAYERTAG.errorCode
    }
}