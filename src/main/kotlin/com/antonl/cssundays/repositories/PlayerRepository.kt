package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.Player
import org.springframework.data.repository.CrudRepository

interface PlayerRepository : CrudRepository<Player, Int> {
    fun findPlayerBySlug(slug: String): Player
    fun findPlayerById(id: Int): Player
}