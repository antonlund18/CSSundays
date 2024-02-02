package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.brackets.Match
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.util.*

interface TournamentRepository : CrudRepository<Tournament, String> {
    fun findById(id: Int): Tournament?
    fun findTournamentByName(name: String): Tournament?
    @Query("select t from Tournament t where t.name like %:name%")
    fun findTournamentsByName(@Param(value = "name") name: String): List<Tournament>
    fun findTournamentByBracketRoot(root: Match): Tournament?
}