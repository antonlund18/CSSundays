package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.brackets.Match
import org.springframework.data.repository.CrudRepository

interface MatchRepository : CrudRepository<Match, String> {
    fun findById(id: Int): Match?
    fun findByParentIdIn(ids: List<Int>): List<Match>
}