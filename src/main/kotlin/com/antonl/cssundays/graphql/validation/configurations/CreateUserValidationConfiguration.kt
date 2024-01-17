package com.antonl.cssundays.graphql.validation.configurations

import com.antonl.cssundays.graphql.errors.CssundaysGraphQLError
import com.antonl.cssundays.graphql.errors.GQLErrorMapper
import com.antonl.cssundays.graphql.validation.validators.*
import com.antonl.cssundays.services.model.core.UserService

class CreateUserValidationConfiguration(val userService: UserService) {
    private val validators = listOf(
        EmailValidator(),
        EmailInUseValidator(userService),
        PlayertagValidator(),
        PlayertagInUseValidator(userService),
        PasswordValidator(),
        PasswordsNotMatchingValidator()
    )

    private val errors: MutableList<Error> = mutableListOf()

    fun validate(input: UserMutationInput): CreateUserValidationConfiguration {
        validators.forEach { it.validate(input, errors) }
        return this
    }

    fun getErrors(): List<Error> {
        return errors
    }

    fun getGQLErrors(): List<CssundaysGraphQLError> {
        return errors.map { GQLErrorMapper.getGQLError(it) }
    }
}