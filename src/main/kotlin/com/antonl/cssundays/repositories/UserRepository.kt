package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.core.User
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface UserRepository : CrudRepository<User, Int> {
    fun findUserBySlug(slug: String): User?
    fun findUserByEmail(email: String): User?
    fun findUserByPlayertag(playertag: String): User?
    @Query("select u from User u where u.playertag like %:playertag%")
    fun findUsersByPlayertag(@Param(value = "playertag") playertag: String): List<User>
    fun findUserById(id: Int): User?
}