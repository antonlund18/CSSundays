package com.antonl.cssundays.graphql.verification.configurations

import com.antonl.cssundays.graphql.verification.verification.Verifier

interface VerificationConfiguration {
    fun getVerifiers(): List<Verifier>
}