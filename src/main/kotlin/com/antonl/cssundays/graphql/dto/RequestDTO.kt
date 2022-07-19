package com.antonl.cssundays.graphql.dto

class RequestDTO(
    val method: String,
    val headers: List<HeaderDTO>,
    val url: String
)
