package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.User
import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, Int> {
    fun findUserBySlug(slug: String): User?
    fun findUserByEmail(email: String): User?
    fun findUserByPlayertag(playertag: String): User?
    fun findUserById(id: Int): User?
}