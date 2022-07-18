package com.antonl.cssundays.services.storage.converters

import aws.smithy.kotlin.runtime.http.request.HttpRequest
import com.antonl.cssundays.model.dto.HeaderDTO
import com.antonl.cssundays.model.dto.RequestDTO

class RequestDTOConverter {
    companion object {
        fun toRequestDTO(request: HttpRequest): RequestDTO {
            return RequestDTO(
                request.method.name,
                request.headers.entries().map { (k, v) -> HeaderDTO(k, v[0]) },
                request.url.host + request.url.encodedPath);
        }
    }
}