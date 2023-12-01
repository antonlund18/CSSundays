package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.repositories.MatchRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class MatchService(val matchRepository: MatchRepository) {
    fun saveMatch(match: Match): Match {
        return matchRepository.save(match)
    }

    fun getMatchesByParentIds(parentIds: List<Int>): List<Match> {
        return matchRepository.findByParentIdIn(parentIds)
    }

    fun getMatchById(matchId: Int): Match? {
        return matchRepository.findById(matchId)
    }
}