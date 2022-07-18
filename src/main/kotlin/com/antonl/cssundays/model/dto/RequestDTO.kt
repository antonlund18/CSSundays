package com.antonl.cssundays.model.dto

class RequestDTO(
     val method: String,
     val headers: List<HeaderDTO>,
     val url: String
)
