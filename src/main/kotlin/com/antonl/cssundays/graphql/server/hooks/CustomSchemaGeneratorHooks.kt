package com.antonl.cssundays.graphql.server.hooks

import com.antonl.cssundays.graphql.server.customtypes.graphqlLocalDateTimeType
import com.expediagroup.graphql.generator.directives.KotlinDirectiveWiringFactory
import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import com.tailrocks.graphql.datetime.GraphqlLocalDateTimeCoercing
import graphql.schema.GraphQLType
import java.time.LocalDateTime
import kotlin.reflect.KClass
import kotlin.reflect.KType

class CustomSchemaGeneratorHooks : SchemaGeneratorHooks {
    override fun willGenerateGraphQLType(type: KType): GraphQLType? {
        return when (type.classifier as? KClass<*>) {
            LocalDateTime::class -> graphqlLocalDateTimeType
            else -> null
        }
    }
}