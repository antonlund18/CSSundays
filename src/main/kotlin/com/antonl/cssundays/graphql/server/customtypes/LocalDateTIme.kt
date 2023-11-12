package com.antonl.cssundays.graphql.server.customtypes

import com.tailrocks.graphql.datetime.GraphqlLocalDateTimeCoercing
import graphql.schema.GraphQLScalarType
import java.time.format.DateTimeFormatter


val graphqlLocalDateTimeType: GraphQLScalarType = GraphQLScalarType.newScalar()
    .name("LocalDateTime")
    .description("DateTime")
    .coercing(GraphqlLocalDateTimeCoercing(false, DateTimeFormatter.ISO_DATE_TIME))
    .build()


