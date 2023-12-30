package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.*
import com.antonl.cssundays.quartz.ScheduledChangeMatchPhaseService
import com.antonl.cssundays.repositories.MatchRepository
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
        when (changeMatchPhaseStrategy) {
            ChangeMatchPhaseStrategy.CANCELLED -> {
                val phaseType = MatchPhaseType.CANCELLED
                val state = null
                match.currentPhase = MatchPhase(match = match, phaseType = phaseType, state = state)
            }

            ChangeMatchPhaseStrategy.WAITING_FOR_TEAMS -> {
                match.currentPhase.phaseType = MatchPhaseType.WAITING_FOR_TEAMS
            }

            ChangeMatchPhaseStrategy.WAITING_TO_START -> {
                match.currentPhase.phaseType = MatchPhaseType.WAITING_TO_START
            }

            ChangeMatchPhaseStrategy.READY_CHECK_ONE_CAPTAIN_PER_TEAM -> {
                val tournamentRegistration1 = match.tournamentRegistration1
                val tournamentRegistration2 = match.tournamentRegistration2
                if (tournamentRegistration1?.captain != null && tournamentRegistration2?.captain != null) {
                    val teamOneAction = MatchReadyCheckPhaseCaptainPerTeamAction(captain = tournamentRegistration1.captain)
                    val teamTwoAction = MatchReadyCheckPhaseCaptainPerTeamAction(captain = tournamentRegistration2.captain)
                    val state = MatchReadyCheckPhaseState(teamOneAction, teamTwoAction)
                    val phaseType = MatchPhaseType.READY_CHECK
                    val endTs = LocalDateTime.now(ZoneOffset.UTC).plusMinutes(15)
                    match.currentPhase = MatchPhase(match = match, phaseType = phaseType, state = state, endTs = endTs)
                    scheduleChangeMatchPhase(match, ChangeMatchPhaseStrategy.READY_CHECK_TIME_OUT, endTs)
                }
            }

            ChangeMatchPhaseStrategy.READY_CHECK_TIME_OUT -> {
                when (match.currentPhase.state) {
                    is MatchReadyCheckPhaseState -> {
                        val state = (match.currentPhase.state as MatchReadyCheckPhaseState)
                        val isTeamOneReady = state.teamOneAction.ready
                        val isTeamTwoReady = state.teamTwoAction.ready
                        if (!isTeamOneReady && !isTeamTwoReady) {
                            changeMatchPhase(match, ChangeMatchPhaseStrategy.CANCELLED)
                            return
                        }
                        if (!isTeamOneReady) {
                            changeMatchPhase(match, ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_2)
                            return
                        }
                        if (!isTeamTwoReady) {
                            changeMatchPhase(match, ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_1)
                            return
                        }
                    }
                }
            }

            ChangeMatchPhaseStrategy.PICK_AND_BAN_BO1 -> {
                match.currentPhase.phaseType = MatchPhaseType.PICK_AND_BAN
            }

            ChangeMatchPhaseStrategy.IN_PROGRESS -> {
                match.currentPhase.phaseType = MatchPhaseType.IN_PROGRESS
            }

            ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_1 -> {
                match.currentPhase.phaseType = MatchPhaseType.FINISHED
            }

            ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_2 -> {
                match.currentPhase.phaseType = MatchPhaseType.FINISHED
            }
        }
    }
}