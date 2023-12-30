package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.*
import com.antonl.cssundays.quartz.ScheduledChangeMatchPhaseService
import com.antonl.cssundays.repositories.MatchRepository
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategyHandlerFactory
import com.antonl.cssundays.services.model.tournaments.matchphase.MatchPhaseType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.transaction.Transactional

@Service
@Transactional
class MatchService(val matchRepository: MatchRepository) {
    @Autowired
    private var scheduledChangeMatchPhaseService: ScheduledChangeMatchPhaseService? = null

    fun saveMatch(match: Match): Match {
        return matchRepository.save(match)
    }

    fun getMatchesByParentIds(parentIds: List<Int>): List<Match> {
        return matchRepository.findByParentIdIn(parentIds)
    }

    fun getMatchById(matchId: Int): Match? {
        return matchRepository.findById(matchId)
    }

    fun createTestMatch(): Match? {
        val match = Match()
        return saveMatch(match)
    }

    fun scheduleChangeMatchPhase(
        match: Match,
        changeMatchPhaseStrategy: ChangeMatchPhaseStrategy,
        time: LocalDateTime
    ) {
        scheduledChangeMatchPhaseService?.let { it.scheduleChangeMatchPhase(match, changeMatchPhaseStrategy, time) }
    }

    fun changeMatchPhase(match: Match, changeMatchPhaseStrategy: ChangeMatchPhaseStrategy) {
        val factory = ChangeMatchPhaseStrategyHandlerFactory(this)
        val handler = factory.getHandler(changeMatchPhaseStrategy)
        handler.execute(match)
    }


    fun markReady(match: Match, player: User): Match {
        if (match.currentPhase.phaseType != MatchPhaseType.READY_CHECK || match.currentPhase.state !is MatchReadyCheckPhaseState) {
            return match
        }

        val state = match.currentPhase.state as MatchReadyCheckPhaseState

        if (match.tournamentRegistration1?.captain == player) {
            state.teamOneAction.ready = true
        }
        if (match.tournamentRegistration2?.captain == player) {
            state.teamTwoAction.ready = true
        }

        if (state.teamOneAction.ready && state.teamTwoAction.ready) {
            changeMatchPhase(match, ChangeMatchPhaseStrategy.PICK_AND_BAN_BO1)
        }

        return saveMatch(match)
    }
}