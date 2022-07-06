package com.antonl.cssundays.services.model

import at.favre.lib.crypto.bcrypt.BCrypt
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.model.User
import com.antonl.cssundays.repositories.UserRepository
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.auth.AuthorizationService
import com.antonl.cssundays.services.storage.UserStorageService
import com.expediagroup.graphql.generator.directives.KotlinSchemaDirectiveEnvironment
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class UserService(val userRepository: UserRepository) {
    fun saveUser(user: User?) {
        if (user != null) {
            userRepository.save(user);
        }
    }

    fun createUser(playertag: String, email: String, password: String): User {
        val user = User(
            playertag = playertag,
            email = email,
            password = BCrypt.withDefaults().hashToString(4, password.toCharArray())
        );
        saveUser(user);
        return user;
    }

    suspend fun uploadPicture(userId: Int, picturePath: String): User? {
        val user = findUserById(userId);
        deletePicture(userId);
        val pictureId = UserStorageService.uploadImage(picturePath);
        user?.picture = pictureId;
        saveUser(user)
        return user;
    }

    suspend fun deletePicture(playerId: Int): User? {
        val user = findUserById(playerId);
        if (!user?.picture.equals("")) {
            UserStorageService.deleteImage(user?.picture);
            user?.picture = "";
            saveUser(user)
        }
        return user;
    }

    fun findUserBySlug(slug: String): User? {
        return userRepository.findUserBySlug(slug)
    }

    fun findUserById(id: Int): User? {
        return userRepository.findUserById(id)
    }

    fun findUserByEmail(email: String): User? {
        return userRepository.findUserByEmail(email)
    }

    fun findUserByPlayertag(playertag: String): User? {
        return userRepository.findUserByPlayertag(playertag)
    }

    fun getAllUsers(): List<User> {
        return userRepository.findAll().toList();
    }

    fun addTeamToUser(team: Team?, user: User?) {
        if (team == null || user == null) {
            return;
        }
        if (!team.users.contains(user)) {
            user.teams.add(team);
            saveUser(user);
        }
    }

    fun handleSignUp(environment: DataFetchingEnvironment,playertag: String, email: String, password: String): String {
        val emailInUse: Boolean = findUserByEmail(email) != null;
        if (emailInUse) {
            throw Exception("Email is already in use")
        }

        val playerTagInUse: Boolean = findUserByPlayertag(playertag) != null;
        if (playerTagInUse) {
            throw Exception("Playertag is already in use")
        }

        val user = createUser(playertag, email, password);
        val jwtToken = AuthenticationService.generateJWTToken(user);
        AuthorizationService.setAuthContext(environment.graphQlContext, jwtToken);
        return jwtToken;
    }
}