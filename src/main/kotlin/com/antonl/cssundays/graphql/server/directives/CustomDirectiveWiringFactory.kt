package com.antonl.cssundays.graphql.server.directives

import com.expediagroup.graphql.generator.directives.KotlinDirectiveWiringFactory
import com.expediagroup.graphql.generator.directives.KotlinSchemaDirectiveWiring

class CustomDirectiveWiringFactory : KotlinDirectiveWiringFactory(
    manualWiring = mapOf<String, KotlinSchemaDirectiveWiring>
        ("lowercase" to LowercaseSchemaDirectiveWiring(),
        "auth" to AuthorizationSchemaDirectiveWiring()
    )) {
}