package com.antonl.cssundays.model.errors

import com.antonl.cssundays.graphql.validation.validators.UserMutationInput

interface HasError {
    fun hasError(input: UserMutationInput): Boolean

    fun getError(): Error
}