package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.tournaments.TournamentRegistration
import org.springframework.stereotype.Service

@Service
class BracketTeamPopulator(val tournamentRegistrations: List<TournamentRegistration>) {
    var numberOfRemainingAutoAdvancedTeams = BracketCalculator.numberOfTeamsToAutomaticallyAdvanceFirstRound(tournamentRegistrations.size)

    fun populateTree(tree: Bracket) {
        val parentsOfLeafNodes = BracketLeafNodeFinder().traverseTree(tree).getParentsOfLeafNodes()

        if (parentsOfLeafNodes.isEmpty() && tournamentRegistrations.isNotEmpty()) {
            tree.root?.tournamentRegistration1 = tournamentRegistrations.getOrNull(0)
            tree.root?.tournamentRegistration2 = tournamentRegistrations.getOrNull(1)
            return
        }

        val remainingTournamentRegistrations = tournamentRegistrations.toMutableList()
        populateMatches(parentsOfLeafNodes, remainingTournamentRegistrations)
    }

    private fun populateMatches(matches: List<Match>, remainingTournamentRegistrations: MutableList<TournamentRegistration>) {
        matches.forEach {
            when {
                numberOfRemainingAutoAdvancedTeams == 0 -> {
                    populateMatchesWithNoTeamsAdvancing(it, remainingTournamentRegistrations)
                }
                numberOfRemainingAutoAdvancedTeams % 2 == 1 -> {
                    populateMatchesWithOneTeamAdvancing(it, remainingTournamentRegistrations)
                }
                numberOfRemainingAutoAdvancedTeams % 2 == 0 -> {
                    populateMatchesWithTwoTeamsAdvancing(it, remainingTournamentRegistrations)
                }
            }
        }
    }

    private fun populateMatchesWithNoTeamsAdvancing(parent: Match, remainingTournamentRegistrations: MutableList<TournamentRegistration>) {
        if (remainingTournamentRegistrations.size < 4) {
            throw Exception("Expected at least 4 teams remaining")
        }

        parent.left?.tournamentRegistration1 = remainingTournamentRegistrations.removeLast()
        parent.left?.tournamentRegistration2 = remainingTournamentRegistrations.removeLast()
        parent.right?.tournamentRegistration1 = remainingTournamentRegistrations.removeLast()
        parent.right?.tournamentRegistration2 = remainingTournamentRegistrations.removeLast()
    }

    private fun populateMatchesWithOneTeamAdvancing(parent: Match, remainingTournamentRegistrations: MutableList<TournamentRegistration>) {
        if (remainingTournamentRegistrations.size < 3) {
            throw Exception("Expected at least 3 teams remaining")
        }

        parent.tournamentRegistration1 = remainingTournamentRegistrations.removeLast()
        numberOfRemainingAutoAdvancedTeams--

        parent.right?.tournamentRegistration1 = remainingTournamentRegistrations.removeLast()
        parent.right?.tournamentRegistration2 = remainingTournamentRegistrations.removeLast()
    }

    private fun populateMatchesWithTwoTeamsAdvancing(parent: Match, remainingTournamentRegistrations: MutableList<TournamentRegistration>) {
        if (remainingTournamentRegistrations.size < 2) {
            throw Exception("Expected at least 2 teams remaining")
        }

        parent.tournamentRegistration1 = remainingTournamentRegistrations.removeLast()
        parent.tournamentRegistration2 = remainingTournamentRegistrations.removeLast()
        numberOfRemainingAutoAdvancedTeams -= 2
    }
}