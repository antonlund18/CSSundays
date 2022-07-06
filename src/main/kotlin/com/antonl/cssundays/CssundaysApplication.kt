package com.antonl.cssundays

import com.antonl.cssundays.graphql.server.directives.CustomDirectiveWiringFactory
import com.antonl.cssundays.graphql.server.hooks.CustomSchemaGeneratorHooks
import com.expediagroup.graphql.generator.directives.KotlinDirectiveWiringFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class CssundaysApplication {
	@Bean
	fun wiringFactory() = CustomDirectiveWiringFactory()

	@Bean
	fun hooks(wiringFactory: KotlinDirectiveWiringFactory) = CustomSchemaGeneratorHooks(wiringFactory)
}

fun main(args: Array<String>) {
    runApplication<CssundaysApplication>(*args)
}
