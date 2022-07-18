package com.antonl.cssundays.graphql.server

import com.antonl.cssundays.graphql.mutations.UserMutations
import com.antonl.cssundays.graphql.queries.UserQueries
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import com.expediagroup.graphql.generator.toSchema
import graphql.schema.GraphQLSchema
import graphql.schema.idl.SchemaPrinter
import java.io.FileWriter


abstract class SchemaGenerator {

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            val schema = generateSchema()
            val schemaString = SchemaPrinter().print(schema)
            writeSchemaToFile(schemaString);
        }

        private fun writeSchemaToFile(schema: String) {
            try {
                val fileWriter = FileWriter("src/js/schema.graphql");
                fileWriter.write(schema);
                fileWriter.close();
            } catch (e: Exception) {
                println(e);
            }
        }

        private fun generateSchema(): GraphQLSchema {
            val schemaGeneratorConfig = SchemaGeneratorConfig(supportedPackages = listOf("com.antonl.cssundays"))
            return toSchema(
                config = schemaGeneratorConfig,
                queries = listOf(TopLevelObject(UserQueries())),
                mutations = listOf(TopLevelObject(UserMutations()))
            )
        }
    }
}