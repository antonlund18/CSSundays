package com.antonl.cssundays.services.auth

import at.favre.lib.crypto.bcrypt.BCrypt
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.util.AuthorizationConstants
import io.github.nefilim.kjwt.JWT
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.regex.Pattern
import javax.transaction.Transactional

@Service
@Transactional
class AuthenticationService() {
    companion object {
        fun handleLogin(user: User?, password: String): String {
            if (verifyPassword(user, password)) {
                return generateJWTToken(user);
            }
            return "";
        }

        fun validatePassword(password: String): Boolean {
            val PASSWORD_PATTERN = "^(?=.*[a-zA-Z0-9æøåÆØÅ!@\$#%&.,]).{6,32}$"
            val pattern = Pattern.compile(PASSWORD_PATTERN)
            val matcher = pattern.matcher(password)
            return matcher.matches()
        }

        fun verifyPassword(user: User?, password: String): Boolean {
            return BCrypt.verifyer().verify(password.toCharArray(), user?.password).verified;
        }

        fun encodePassword(password: String): String {
            return BCrypt.withDefaults().hashToString(4, password.toCharArray());
        }

        fun generateJWTToken(user: User?): String {
            val issuer = user?.id.toString();
            val jwt = JWT.rs256 {
                issuer(issuer);
                expiresAt(LocalDateTime.now().plusDays(7))
                issuedNow()
                claim(AuthorizationConstants.JWT_USER_ROLE_CLAIM, user?.role.toString())
            }
            return jwt.encode(); // TODO: .sign() with a private key instead of encode()
        }
    }
}