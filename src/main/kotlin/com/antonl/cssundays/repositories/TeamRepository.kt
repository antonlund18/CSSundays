package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.core.Team
import org.springframework.data.repository.CrudRepository

interface TeamRepository : CrudRepository<Team, String> {
    fun findTeamByName(name: String): Team?
    fun findTeamById(id: Int): Team?
}