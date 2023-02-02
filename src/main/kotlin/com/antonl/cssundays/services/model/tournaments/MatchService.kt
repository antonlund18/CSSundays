package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.tournaments.Match
import com.antonl.cssundays.repositories.MatchRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class MatchService(val matchRepository: MatchRepository) {
    fun saveMatch(match: Match): Match {
        return matchRepository.save(match)
    }

    fun createMatch(): Match {
        val match = Match()
        return saveMatch(match)
    }
}