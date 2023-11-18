package com.antonl.cssundays.graphql.errors

import graphql.GraphQLError
import graphql.language.SourceLocation

interface CssundaysGraphQLError : GraphQLError {
    override fun getExtensions(): Map<String, Any> = hashMapOf(Pair("errorCode", getErrorCode()), Pair("errorType", errorType))
    override fun getLocations(): MutableList<SourceLocation> = mutableListOf()
    fun getErrorCode(): Int
}