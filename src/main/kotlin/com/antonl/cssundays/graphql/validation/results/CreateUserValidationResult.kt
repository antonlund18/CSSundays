package com.antonl.cssundays.graphql.validation.results

import com.antonl.cssundays.graphql.validation.configurations.CreateUserValidationConfiguration
import com.antonl.cssundays.graphql.validation.configurations.ValidationConfiguration
import com.antonl.cssundays.graphql.validation.validators.*
import com.antonl.cssundays.services.model.core.UserService

class CreateUserValidationResult(val userService: UserService, input: UserMutationInput) : ValidationResult(input) {
    override fun getConfiguration(): ValidationConfiguration {
        return CreateUserValidationConfiguration(userService)
    }

}