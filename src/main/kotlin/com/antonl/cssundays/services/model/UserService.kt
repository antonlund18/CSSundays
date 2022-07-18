package com.antonl.cssundays.services.model

import com.antonl.cssundays.model.dto.RequestDTO
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.model.User
import com.antonl.cssundays.repositories.UserRepository
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.storage.UserStorageService
import org.springframework.stereotype.Service
import java.util.*
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
            password = AuthenticationService.encodePassword(password)
        );
        saveUser(user);
        return user;
    }

    suspend fun setPicture(user: User): RequestDTO {
        deletePicture(user);
        val imageKey = UUID.randomUUID().toString() + ".jpg";
        user.picture = imageKey;
        saveUser(user)
        return UserStorageService.getPresignedUploadRequest(imageKey);
    }

    suspend fun deletePicture(user: User): User? {
        if (!user.picture.equals("")) {
            UserStorageService.deleteImage(user.picture);
            user.picture = "";
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

    fun addTeamToUser(team: Team?, user: User?) {
        if (team == null || user == null) {
            return;
        }
        if (!team.users.contains(user)) {
            user.teams.add(team);
            saveUser(user);
        }
    }

    fun handleSignUp(playertag: String, email: String, password: String): String {
        val emailInUse: Boolean = findUserByEmail(email) != null;

        // TODO: Better error handling
        if (emailInUse) {
            throw Exception("Email is already in use")
        }

        val playerTagInUse: Boolean = findUserByPlayertag(playertag) != null;
        if (playerTagInUse) {
            throw Exception("Playertag is already in use")
        }

        val user = createUser(playertag, email, password);
        val jwtToken = AuthenticationService.generateJWTToken(user);
        return jwtToken;
    }
}