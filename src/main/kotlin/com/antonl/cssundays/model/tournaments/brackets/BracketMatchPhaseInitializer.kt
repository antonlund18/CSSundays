package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.tournaments.brackets.matches.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.MatchService
import java.util.*

class BracketMatchPhaseInitializer(val matchService: MatchService) {
    fun initializeMatchPhases(tree: Bracket) {
        val queue: Queue<Match> = LinkedList()
        queue.add(tree.root)

        while (!queue.isEmpty()) {
            val currentNode = queue.poll()

            if (currentNode == null) {
                return
            }

            initializeMatchPhase(currentNode)

            queue.add(currentNode.left)
            queue.add(currentNode.right)
        }
    }

    private fun initializeMatchPhase(match: Match) {
        val tournamentRegistrationOne = match.tournamentRegistration1
        val tournamentRegistrationTwo = match.tournamentRegistration2

        val hasTeamOne = tournamentRegistrationOne != null
        val hasTeamTwo = tournamentRegistrationTwo != null
        val hasBothTeams = hasTeamOne && hasTeamTwo
        val hasNoTeams = !hasTeamOne && !hasTeamTwo

        if (hasBothTeams) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.READY_CHECK_ONE_CAPTAIN_PER_TEAM)
            return
        }
        if (hasTeamOne || hasTeamTwo) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.WAITING_FOR_TEAMS)
            return
        }
        if (hasNoTeams) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.CANCELLED)
            return
        }
    }
}