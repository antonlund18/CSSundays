package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.services.auth.AuthorizationService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Query
import org.hibernate.Hibernate
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

    suspend fun getCurrentUser(token: String): User? {
        if (!AuthorizationService.isValidToken(token)) return null;
        val userId = AuthorizationService.getIssuer(token)?.toInt() ?: return null;
        val user = userService.findUserById(userId);
        return user;
    }

    suspend fun getAllUsers(): List<User> {
        return userService.getAllUsers();
    }

    suspend fun getUserBySlug(slug: String): User? {
        return userService.findUserBySlug(slug);
    }
}