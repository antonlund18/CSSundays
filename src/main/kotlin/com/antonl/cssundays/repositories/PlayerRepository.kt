package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.Player
import org.springframework.data.repository.CrudRepository

interface PlayerRepository : CrudRepository<Player, Long> {
    fun findPlayerBySlug(slug: String): Player
    fun findPlayerById(id: Long): Player
}