package com.antonl.cssundays.graphql.mutations.admin

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AdminMatchMutations : Mutation {
    @Autowired
    private lateinit var matchService: MatchService

    suspend fun createTestMatch(): Match? {
        return matchService.createTestMatch()
    }
}