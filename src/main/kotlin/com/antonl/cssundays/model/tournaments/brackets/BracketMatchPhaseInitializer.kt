package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.MatchService
import java.util.*

class BracketMatchPhaseInitializer(val matchService: MatchService) {
    fun initializeMatchPhases(tree: Bracket) {
        val queue: Queue<Match> = LinkedList()

        if (tree.root != null) {
            queue.add(tree.root)
        }

        while (!queue.isEmpty()) {
            val currentNode = queue.poll()

            initializeMatchPhase(currentNode)

            if (currentNode.left != null) {
                queue.add(currentNode.left)
            }

            if (currentNode.right != null) {
                queue.add(currentNode.right)
            }
        }
    }

    private fun initializeMatchPhase(match: Match) {
        val tournamentRegistrationOne = match.tournamentRegistration1
        val tournamentRegistrationTwo = match.tournamentRegistration2

        val hasTeamOne = tournamentRegistrationOne != null
        val hasTeamTwo = tournamentRegistrationTwo != null
        val hasBothTeams = hasTeamOne && hasTeamTwo
        val hasNoTeams = !hasTeamOne && !hasTeamTwo
        val matchIsLeaf = match.left == null && match.right == null

        if (hasBothTeams) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.WAITING_TO_START)
            return
        }
        if (hasTeamOne || hasTeamTwo) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.WAITING_FOR_TEAMS)
            return
        }
        if (matchIsLeaf && hasNoTeams) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.CANCELLED)
            return
        }
        if (hasNoTeams) {
            matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.WAITING_FOR_TEAMS)
        }
    }
}