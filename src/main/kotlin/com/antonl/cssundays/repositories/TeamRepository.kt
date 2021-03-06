package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.Team
import org.springframework.data.repository.CrudRepository

interface TeamRepository : CrudRepository<Team, String> {
    fun findTeamBySlug(slug: String): Team
    fun findTeamById(id: Int): Team
}