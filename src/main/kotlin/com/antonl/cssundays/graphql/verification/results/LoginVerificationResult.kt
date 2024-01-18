package com.antonl.cssundays.graphql.verification.results

import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.graphql.verification.configurations.LoginVerificationConfiguration
import com.antonl.cssundays.graphql.verification.configurations.VerificationConfiguration
import com.antonl.cssundays.services.model.core.UserService

class LoginVerificationResult(val userService: UserService, input: UserMutationInput) : VerificationResult(input) {
    override fun getConfiguration(): VerificationConfiguration {
        return LoginVerificationConfiguration(userService);
    }
}