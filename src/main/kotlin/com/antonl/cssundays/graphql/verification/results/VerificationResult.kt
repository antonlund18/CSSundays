package com.antonl.cssundays.graphql.verification.results

import com.antonl.cssundays.graphql.errors.CssundaysGraphQLError
import com.antonl.cssundays.graphql.errors.GQLErrorMapper
import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.graphql.verification.configurations.VerificationConfiguration
import com.antonl.cssundays.model.errors.Error
import com.antonl.cssundays.model.errors.HasErrors

abstract class VerificationResult(val input: UserMutationInput) : HasErrors {
    private val errors: MutableList<Error> = mutableListOf()

    fun verify(): VerificationResult {
        getConfiguration().getVerifiers().forEach { it.verify(input, errors) }
        return this
    }


    override fun getErrors(): List<Error> {
        return errors
    }

    override fun hasErrors(): Boolean {
        return errors.isNotEmpty()
    }

    fun getGQLErrors(): List<CssundaysGraphQLError> {
        return errors.map { GQLErrorMapper.getGQLError(it) }
    }

    abstract fun getConfiguration(): VerificationConfiguration
}