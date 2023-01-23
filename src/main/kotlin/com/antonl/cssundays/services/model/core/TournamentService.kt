package com.antonl.cssundays.services.model.core

import com.antonl.cssundays.model.core.Tournament
import com.antonl.cssundays.repositories.TournamentRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class TournamentService(val tournamentRepository: TournamentRepository) {
    fun saveTournament(tournament: Tournament?) {
        if (tournament != null) {
            tournamentRepository.save(tournament)
        }
    }

    fun getAllTournaments(): List<Tournament> {
        return tournamentRepository.findAll().toList()
    }

    fun createTournament(name: String, date: String, numberOfTeamsAllowed: Int): Tournament {
        val tournament = Tournament(
            name = name,
            date = date,
            numberOfTeamsAllowed = numberOfTeamsAllowed
        )
        saveTournament(tournament)
        return tournament
    }
}