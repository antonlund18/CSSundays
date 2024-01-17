package com.antonl.cssundays.graphql.validation.validators

class PasswordsNotMatchingValidator : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        return input.password != input.passwordRepeated
    }

    override fun getError(): Error {
        return Error.PASSWORDS_NOT_MATCHING
    }

}