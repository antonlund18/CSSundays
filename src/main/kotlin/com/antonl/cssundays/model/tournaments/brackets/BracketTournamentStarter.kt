package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import java.util.*

class BracketTournamentStarter(val matchService: MatchService) {
    fun startTournament(tree: Bracket) {
        val queue: Queue<Match> = LinkedList()
        if (tree.root != null) {
            queue.add(tree.root)
        }

        while (!queue.isEmpty()) {
            val currentNode = queue.poll()

            if (currentNode.tournamentRegistration1 != null && currentNode.tournamentRegistration2 != null) {
                matchService.changeMatchPhase(currentNode, ChangeMatchPhaseStrategy.READY_CHECK_ONE_CAPTAIN_PER_TEAM)
            }


            if (currentNode.left != null) {
                queue.add(currentNode.left)
            }

            if (currentNode.right != null) {
                queue.add(currentNode.right)
            }
        }
    }
}