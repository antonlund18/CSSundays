package com.antonl.cssundays.graphql.server

import com.antonl.cssundays.graphql.mutations.*
import com.antonl.cssundays.graphql.mutations.admin.AdminMatchMutations
import com.antonl.cssundays.graphql.mutations.admin.AdminTestDataMutations
import com.antonl.cssundays.graphql.queries.*
import com.antonl.cssundays.graphql.server.hooks.CustomSchemaGeneratorHooks
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
                config = SchemaGeneratorConfig(hooks = CustomSchemaGeneratorHooks(), supportedPackages = listOf("com.antonl.cssundays")),
                queries = listOf(
                    TopLevelObject(UserQueries()),
                    TopLevelObject(TeamQueries()),
                    TopLevelObject(InviteToTeamQueries()),
                    TopLevelObject(NotificationQueries()),
                    TopLevelObject(TournamentQueries()),
                    TopLevelObject(MatchQueries())
                ),
                mutations = listOf(
                    TopLevelObject(UserMutations()),
                    TopLevelObject(TeamMutations()),
                    TopLevelObject(SharedTeamAndUserMutations()),
                    TopLevelObject(InviteToTeamMutations()),
                    TopLevelObject(NotificationMutations()),
                    TopLevelObject(TournamentMutations()),
                    TopLevelObject(SharedTournamentAndTournamentRegistrationMutations()),
                    TopLevelObject(AdminMatchMutations()),
                    TopLevelObject(AdminTestDataMutations()),
                    TopLevelObject(MatchMutations())
                ),
                subscriptions = listOf(
                    TopLevelObject(SimpleSubscription())
                )
            )
        }
    }
}