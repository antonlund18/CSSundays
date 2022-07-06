package com.antonl.cssundays.graphql.server.context

import com.antonl.cssundays.util.AuthorizationConstants
import com.expediagroup.graphql.server.spring.execution.DefaultSpringGraphQLContextFactory
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest


@Component
class MyGraphQLContextFactory : DefaultSpringGraphQLContextFactory() {
    override suspend fun generateContextMap(request: ServerRequest): Map<*, Any> =
        super.generateContextMap(request) + mapOf(
            AuthorizationConstants.GRAPHQL_CONTEXT_AUTH to (request.headers().firstHeader("Authorization")?.replace("Bearer ", "") ?: "")
        )
}