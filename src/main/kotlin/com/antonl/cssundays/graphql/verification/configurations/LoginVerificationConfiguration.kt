package com.antonl.cssundays.graphql.verification.configurations

import com.antonl.cssundays.graphql.verification.verification.LoginVerifier
import com.antonl.cssundays.graphql.verification.verification.Verifier
import com.antonl.cssundays.services.model.core.UserService

class LoginVerificationConfiguration(val userService: UserService) : VerificationConfiguration {
    private val verifiers = listOf(
        LoginVerifier(userService),
    )

    override fun getVerifiers(): List<Verifier> {
        return verifiers
    }
}