package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.Tournament
import org.springframework.data.repository.CrudRepository

interface TournamentRepository : CrudRepository<Tournament, String> {

}