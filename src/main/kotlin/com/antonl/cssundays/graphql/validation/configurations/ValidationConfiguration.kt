package com.antonl.cssundays.graphql.validation.configurations

import com.antonl.cssundays.graphql.validation.validators.Validator

interface ValidationConfiguration {
    fun getValidators(): List<Validator>
}