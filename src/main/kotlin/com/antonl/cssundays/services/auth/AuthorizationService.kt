package com.antonl.cssundays.services.auth

import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.util.AuthorizationConstants
import graphql.GraphQLContext
import io.github.nefilim.kjwt.JWT
import java.time.LocalDateTime
import java.time.ZoneOffset

class AuthorizationService {
    companion object {
        fun setAuthContext(context: GraphQLContext, token: String) {
            context.put(AuthorizationConstants.GRAPHQL_CONTEXT_AUTH, token);
        }

        fun isTokenExpired(token: String): Boolean {
            return JWT.decode(token)
                .fold(
                    { true },
                    { decodedJWT -> decodedJWT.expiresAt().orNull()?.isBefore(LocalDateTime.now(ZoneOffset.UTC)) ?: true }
                )
        }

        fun isValidToken(token: String): Boolean {
            // TODO: verifySignature<>()
            return !isTokenExpired(token);
        }

        fun getIssuer(token: String): String? {
            return JWT.decode(token)
                .fold(
                    { null },
                    { decodedJWT -> decodedJWT.issuer().orNull() }
                )
        }

        fun getUserRoleFromToken(token: String): UserRole {
            return JWT.decode(token)
                .fold(
                    { UserRole.NONE },
                    { decodedJWT ->
                        UserRole.valueOf(
                            decodedJWT.claimValue(AuthorizationConstants.JWT_USER_ROLE_CLAIM).orNull() ?: "NONE"
                        )
                    }
                )
        }
    }
}