package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class UserNotFoundError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "User not found"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.USER_NOT_FOUND
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.USER_NOT_FOUND.errorCode
    }
}