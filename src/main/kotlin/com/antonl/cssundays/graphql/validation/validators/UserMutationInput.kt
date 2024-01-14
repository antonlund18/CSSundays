package com.antonl.cssundays.graphql.validation.validators

class UserMutationInput(
    val id: Int? = null,
    val playertag: String? = null,
    val email: String? = null,
    val password: String? = null,
    val passwordRepeated: String? = null,
)