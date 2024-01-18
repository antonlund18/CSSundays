package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.model.errors.Error
import com.antonl.cssundays.model.errors.HasError

abstract class Validator : HasError {
    fun validate(input: UserMutationInput, errors: MutableList<Error>) {
        if (hasError(input)) {
            errors.add(getError())
        }
    }
}