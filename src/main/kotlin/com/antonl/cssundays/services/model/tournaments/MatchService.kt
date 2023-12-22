package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.ChangeMatchPhaseStrategy
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhaseType
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchReadyCheckPhaseCaptainPerTeamAction
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchReadyCheckPhaseState
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

    fun createTestMatch(): Match? {
        val match = Match()
        return saveMatch(match)
    }

    fun changeMatchPhase(match: Match, changeMatchPhaseStrategy: ChangeMatchPhaseStrategy): Match {
        when (changeMatchPhaseStrategy) {
            ChangeMatchPhaseStrategy.CANCELLED -> {
                match.currentPhase.phaseType = MatchPhaseType.CANCELLED
                match.currentPhase.state = null
            }

            ChangeMatchPhaseStrategy.WAITING_FOR_TEAMS -> {
                match.currentPhase.phaseType = MatchPhaseType.WAITING_FOR_TEAMS
            }
            ChangeMatchPhaseStrategy.WAITING_TO_START -> {
                match.currentPhase.phaseType = MatchPhaseType.WAITING_TO_START
            }
            ChangeMatchPhaseStrategy.READY_CHECK_ONE_CAPTAIN_PER_TEAM -> {
                if (match.team1?.users?.get(0) != null && match.team2?.users?.get(0) != null) {
                    val teamOneAction = MatchReadyCheckPhaseCaptainPerTeamAction(captain = match.team1?.users?.get(0)!!)
                    val teamTwoAction = MatchReadyCheckPhaseCaptainPerTeamAction(captain = match.team2?.users?.get(0)!!)
                    match.currentPhase.phaseType = MatchPhaseType.READY_CHECK
                    match.currentPhase.state = MatchReadyCheckPhaseState(teamOneAction, teamTwoAction)
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
        return saveMatch(match)
    }
}