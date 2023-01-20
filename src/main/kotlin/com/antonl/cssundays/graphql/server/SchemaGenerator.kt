package com.antonl.cssundays.graphql.server

import com.antonl.cssundays.graphql.mutations.*
import com.antonl.cssundays.graphql.queries.InviteToTeamQueries
import com.antonl.cssundays.graphql.queries.NotificationQueries
import com.antonl.cssundays.graphql.queries.TeamQueries
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
            writeSchemaToFile(schemaString)
        }

        private fun writeSchemaToFile(schema: String) {
            try {
                val fileWriter = FileWriter("src/webapp/schema.graphql");
                fileWriter.write(schema);
                fileWriter.close();
            } catch (e: Exception) {
                println(e);
            }
        }

        private fun generateSchema(): GraphQLSchema {
            return toSchema(
                config = SchemaGeneratorConfig(supportedPackages = listOf("com.antonl.cssundays")),
                queries = listOf(
                    TopLevelObject(UserQueries()),
                    TopLevelObject(TeamQueries()),
                    TopLevelObject(InviteToTeamQueries()),
                    TopLevelObject(NotificationQueries())
                ),
                mutations = listOf(
                    TopLevelObject(UserMutations()),
                    TopLevelObject(TeamMutations()),
                    TopLevelObject(SharedTeamAndUserMutations()),
                    TopLevelObject(InviteToTeamMutations()),
                    TopLevelObject(NotificationMutations()),
                )
            )
        }
    }
}