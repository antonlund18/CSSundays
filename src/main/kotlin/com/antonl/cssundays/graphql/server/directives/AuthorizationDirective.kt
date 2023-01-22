package com.antonl.cssundays.graphql.server.directives

import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.util.AuthorizationConstants
import com.expediagroup.graphql.generator.annotations.GraphQLDirective
import graphql.introspection.Introspection.DirectiveLocation

@Repeatable
@GraphQLDirective(
    name = AuthorizationConstants.GRAPHQL_CONTEXT_AUTH,
    description = "Add authorization to a query or field",
    locations = [DirectiveLocation.OBJECT, DirectiveLocation.FIELD, DirectiveLocation.FIELD_DEFINITION])
annotation class AuthorizationDirective(val roles: Array<UserRole>)