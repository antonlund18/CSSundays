package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.model.errors.Error

class PasswordsNotMatchingValidator : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        return input.newPassword != input.newPasswordRepeated
    }

    override fun getError(): Error {
        return Error.PASSWORDS_NOT_MATCHING
    }

}