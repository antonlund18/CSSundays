package com.antonl.cssundays.services.model.core

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.graphql.mutations.EditUserInput
import com.antonl.cssundays.graphql.validation.configurations.CreateUserValidationConfiguration
import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.graphql.validation.validators.Error
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.repositories.UserRepository
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.storage.UserStorageService
import org.springframework.stereotype.Service
import java.util.*
import javax.transaction.Transactional

@Service
@Transactional
class UserService(val userRepository: UserRepository) {
    fun saveUser(user: User?): User? {
        if (user != null) {
            return userRepository.save(user);
        }
        return null
    }

    fun createUser(playertag: String, email: String, password: String): User {
        val user = User(
            playertag = playertag,
            email = email,
            password = AuthenticationService.encodePassword(password),
        );
        saveUser(user);
        return user;
    }

    fun updatePlayer(player: User, updates: EditUserInput): User? {
        player.email = updates.email
        player.description = updates.description
        return saveUser(player)
    }

    fun verifyPassword(player: User, password: String) {
        val correctPassword: Boolean = AuthenticationService.verifyPassword(player, password)
        if (!correctPassword) throw IncorrectPasswordException("Incorrect password")
    }

    fun isValidEmail(email: String): Boolean {
        return AuthenticationService.validateEmail(email)
    }

    fun isValidPassword(password: String): Boolean {
        return AuthenticationService.validatePassword(password)
    }

    fun isValidPlayertag(playertag: String): Boolean {
        return AuthenticationService.validateUsername(playertag)
    }

    fun changePassword(player: User, newPassword: String): User? {
        player.password = AuthenticationService.encodePassword(newPassword)
        return saveUser(player)
    }

    suspend fun setPicture(user: User): RequestDTO {
        deletePicture(user);
        val imageKey = UUID.randomUUID().toString() + ".png";
        user.picture = imageKey;
        saveUser(user)
        return UserStorageService().getPresignedUploadRequest(imageKey);
    }

    suspend fun deletePicture(user: User): User? {
        if (!user.picture.equals(null)) {
            UserStorageService().deleteImage(user.picture);
            user.picture = null;
            saveUser(user);
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

    fun validateCreateUser(input: UserMutationInput): CreateUserValidationConfiguration {
        return CreateUserValidationConfiguration(this).validate(input)
    }

    fun handleSignUp(playertag: String, email: String, password: String): String {
        val user = createUser(playertag, email, password);
        val jwtToken = AuthenticationService.generateJWTToken(user);
        return jwtToken;
    }

    fun changeUserRole(user: User, targetRole: UserRole): User? {
        user.role = targetRole
        return saveUser(user)
    }
}