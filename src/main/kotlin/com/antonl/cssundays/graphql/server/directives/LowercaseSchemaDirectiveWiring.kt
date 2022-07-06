package com.antonl.cssundays.graphql.server.directives

import com.expediagroup.graphql.generator.directives.KotlinFieldDirectiveEnvironment
import com.expediagroup.graphql.generator.directives.KotlinSchemaDirectiveWiring
import graphql.schema.DataFetcher
import graphql.schema.DataFetcherFactories
import graphql.schema.GraphQLFieldDefinition

class LowercaseSchemaDirectiveWiring : KotlinSchemaDirectiveWiring {
    override fun onField(environment: KotlinFieldDirectiveEnvironment): GraphQLFieldDefinition {
        val field = environment.element;
        val originalDataFetcher: DataFetcher<*> = environment.getDataFetcher();
        val lowerCaseFetcher = DataFetcherFactories.wrapDataFetcher(originalDataFetcher) { _, value ->
            value.toString().lowercase();
        }
        environment.setDataFetcher(lowerCaseFetcher);
        return field;
    }
}