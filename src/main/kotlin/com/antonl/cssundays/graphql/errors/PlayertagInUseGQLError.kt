package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class PlayertagInUseGQLError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "Playertag in use"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.PLAYERTAG_IN_USE
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.PLAYERTAG_IN_USE.errorCode
    }
}