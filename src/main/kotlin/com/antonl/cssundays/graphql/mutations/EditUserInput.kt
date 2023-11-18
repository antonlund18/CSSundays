package com.antonl.cssundays.graphql.mutations


class EditUserInput(
    val id: Int,
    val email: String,
    val description: String)