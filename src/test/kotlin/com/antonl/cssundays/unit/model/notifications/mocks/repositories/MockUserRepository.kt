package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.repositories.UserRepository
import java.util.*

class MockUserRepository : UserRepository {
    override fun findUserBySlug(slug: String): User? {
        TODO("Not yet implemented")
    }

    override fun findUserByEmail(email: String): User? {
        TODO("Not yet implemented")
    }

    override fun findUserByPlayertag(playertag: String): User? {
        TODO("Not yet implemented")
    }

    override fun findUsersByPlayertag(playertag: String): List<User> {
        TODO("Not yet implemented")
    }

    override fun findUserById(id: Int): User? {
        TODO("Not yet implemented")
    }

    override fun <S : User?> save(entity: S): S {
        return entity;
    }

    override fun <S : User?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<User> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<Int>): MutableIterable<User> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun delete(entity: User) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<Int>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<User>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        TODO("Not yet implemented")
    }

    override fun deleteById(id: Int) {
        TODO("Not yet implemented")
    }

    override fun existsById(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    override fun findById(id: Int): Optional<User> {
        TODO("Not yet implemented")
    }
}