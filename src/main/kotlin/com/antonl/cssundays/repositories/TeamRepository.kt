package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param

interface TeamRepository : CrudRepository<Team, String> {
    fun findTeamByName(name: String): Team?
    @Query("select t from Team t where t.name like %:name%")
    fun findTeamsByName(@Param("name") name: String): List<Team>
    fun findTeamById(id: Int): Team?
    fun findTeamsByOwner(owner: User): List<Team>
}