package com.antonl.cssundays.graphql.server.directives

import com.expediagroup.graphql.generator.annotations.GraphQLDirective

@GraphQLDirective(name = "lowercase", description = "Modifies to string field to lowercase")
annotation class LowercaseDirective