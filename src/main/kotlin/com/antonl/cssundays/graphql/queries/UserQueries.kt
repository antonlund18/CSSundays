package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.graphql.server.directives.AuthorizationDirective
import com.antonl.cssundays.model.User
import com.antonl.cssundays.model.UserRole
import com.antonl.cssundays.services.auth.AuthorizationService
import com.antonl.cssundays.services.model.UserService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class UserQueries : Query {
    @Autowired
    private lateinit var userService: UserService;

    suspend fun getUserById(id: Int): User? {
        return userService.findUserById(id);
    }

    @AuthorizationDirective(role = UserRole.USER)
    suspend fun getCurrentUser(token: String): User? {
        if (!AuthorizationService.isValidToken(token)) return null;
        val userId = AuthorizationService.getIssuer(token)?.toInt() ?: return null;
        return userService.findUserById(userId);
    }

    suspend fun getAllUsers(): List<User> {
        return userService.getAllUsers();
    }

    suspend fun getUserBySlug(slug: String): User? {
        return userService.findUserBySlug(slug);
    }
}