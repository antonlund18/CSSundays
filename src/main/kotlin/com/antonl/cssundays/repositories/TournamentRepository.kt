package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.Tournament
import org.springframework.data.repository.CrudRepository
import java.util.*

interface TournamentRepository : CrudRepository<Tournament, String> {
    fun findById(id: Int): Tournament?
}