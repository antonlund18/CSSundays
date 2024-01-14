package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

class EmailInUseGQLError : CssundaysGraphQLError {
    override fun getMessage(): String {
        return "E-mail in use"
    }

    override fun getErrorType(): ErrorClassification {
        return ErrorTypes.EMAIL_IN_USE
    }

    override fun getErrorCode(): Int {
        return ErrorTypes.EMAIL_IN_USE.errorCode
    }
}