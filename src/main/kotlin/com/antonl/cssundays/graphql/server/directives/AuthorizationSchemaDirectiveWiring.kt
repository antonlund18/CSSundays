package com.antonl.cssundays.graphql.server.directives

import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.services.auth.AuthorizationService
import com.antonl.cssundays.util.AuthorizationConstants
import com.expediagroup.graphql.generator.directives.KotlinFieldDirectiveEnvironment
import com.expediagroup.graphql.generator.directives.KotlinSchemaDirectiveWiring
import graphql.GraphQLContext
import graphql.schema.DataFetcher
import graphql.schema.GraphQLFieldDefinition

class AuthorizationSchemaDirectiveWiring : KotlinSchemaDirectiveWiring {
    override fun onField(environment: KotlinFieldDirectiveEnvironment): GraphQLFieldDefinition {
        val targetAuthRole: UserRole = environment.directive.getArgument(AuthorizationConstants.JWT_USER_ROLE_CLAIM).argumentValue.value as UserRole;
        val originalDataFetcher: DataFetcher<*> = environment.getDataFetcher();
        val authDataFetcher = getAuthDataFetcher(targetAuthRole, originalDataFetcher);
        environment.setDataFetcher(authDataFetcher);
        return environment.element;
    }

    fun getAuthDataFetcher(targetAuthRole: UserRole, originalDataFetcher: DataFetcher<*>): DataFetcher<Any> {
        return DataFetcher<Any> { dataEnv ->
            val contextMap: GraphQLContext = dataEnv.graphQlContext

            val jwtToken: String = contextMap.get(AuthorizationConstants.GRAPHQL_CONTEXT_AUTH);
            if (!AuthorizationService.isValidToken(jwtToken)) {
                throw java.lang.RuntimeException("You are not authorized to access this resource!");
            }

            val auth: UserRole = AuthorizationService.getUserRoleFromToken(jwtToken);
            if (auth != targetAuthRole) {
                throw java.lang.RuntimeException("You are not authorized to access this resource!");
            }
            originalDataFetcher.get(dataEnv);
        }
    }
}