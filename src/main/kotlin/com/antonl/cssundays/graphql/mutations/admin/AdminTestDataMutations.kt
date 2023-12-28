package com.antonl.cssundays.graphql.mutations.admin

import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AdminTestDataMutations : Mutation {
    @Autowired
    private lateinit var userService: UserService

    suspend fun createTestData() {
        userService.createUser("Anton", "antonlund95@gmail.com", "asdasd")
    }
}