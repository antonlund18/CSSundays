package com.antonl.cssundays.graphql.validation.results

import com.antonl.cssundays.graphql.validation.configurations.ChangePasswordValidationConfiguration
import com.antonl.cssundays.graphql.validation.configurations.ValidationConfiguration
import com.antonl.cssundays.graphql.validation.validators.*
import com.antonl.cssundays.services.model.core.UserService

class ChangePasswordValidationResult(val userService: UserService, input: UserMutationInput)  : ValidationResult(input) {
    override fun getConfiguration(): ValidationConfiguration {
        return ChangePasswordValidationConfiguration(userService)
    }
}