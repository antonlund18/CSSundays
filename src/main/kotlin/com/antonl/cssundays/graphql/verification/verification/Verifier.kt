package com.antonl.cssundays.graphql.verification.verification

import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.model.errors.Error
import com.antonl.cssundays.model.errors.HasError

abstract class Verifier : HasError {
    fun verify(input: UserMutationInput, errors: MutableList<Error>) {
        if (hasError(input)) {
            errors.add(getError())
        }
    }
}