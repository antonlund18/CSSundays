package com.antonl.cssundays.graphql.validation.configurations

import com.antonl.cssundays.graphql.validation.validators.*
import com.antonl.cssundays.services.model.core.UserService

class CreateUserValidationConfiguration(val userService: UserService) : ValidationConfiguration {
    private val validators = listOf(
        EmailValidator(),
        EmailInUseValidator(userService),
        PlayertagValidator(),
        PlayertagInUseValidator(userService),
        PasswordValidator(),
        PasswordsNotMatchingValidator()
    )

    override fun getValidators(): List<Validator> {
        return validators
    }
}