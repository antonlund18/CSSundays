package com.antonl.cssundays.model.tournaments

import com.antonl.cssundays.model.core.Team

class BracketTeamPopulator(val teams: List<Team>) {
    var numberOfRemainingAutoAdvancedTeams = BracketCalculator.numberOfTeamsToAutomaticallyAdvanceFirstRound(teams.size)

    fun populateTree(tree: Bracket) {
        val leafFinder = BracketLeafNodeFinder()
        leafFinder.traverseTree(tree)
        val parentsOfLeafNodes = leafFinder.getParentsOfLeafNodes()

        if (parentsOfLeafNodes.size == 0) {
            return
        }

        val remainingTeams = teams.toMutableList()
        populateMatches(parentsOfLeafNodes, remainingTeams)
    }

    private fun populateMatches(matches: MutableList<Match>, remainingTeams: MutableList<Team>) {
        matches.forEach {
            when {
                numberOfRemainingAutoAdvancedTeams == 0 -> {
                    populateMatchesWithNoTeamsAdvancing(it, remainingTeams)
                }
                numberOfRemainingAutoAdvancedTeams % 2 == 1 -> {
                    populateMatchesWithOneTeamAdvancing(it, remainingTeams)
                }
                numberOfRemainingAutoAdvancedTeams % 2 == 0 -> {
                    populateMatchesWithTwoTeamsAdvancing(it, remainingTeams)
                }
            }
        }
    }

    private fun populateMatchesWithNoTeamsAdvancing(parent: Match, remainingTeams: MutableList<Team>) {
        if (remainingTeams.size < 4) {
            throw Exception("Expected at least 4 teams remaining")
        }

        parent.left?.team1 = remainingTeams.removeLast()
        parent.left?.team2 = remainingTeams.removeLast()
        parent.right?.team1 = remainingTeams.removeLast()
        parent.right?.team2 = remainingTeams.removeLast()
    }

    private fun populateMatchesWithOneTeamAdvancing(parent: Match, remainingTeams: MutableList<Team>) {
        if (remainingTeams.size < 3) {
            throw Exception("Expected at least 3 teams remaining")
        }

        parent.team1 = remainingTeams.removeLast()
        numberOfRemainingAutoAdvancedTeams--

        parent.left?.team1 = remainingTeams.removeLast()
        parent.left?.team2 = remainingTeams.removeLast()
    }

    private fun populateMatchesWithTwoTeamsAdvancing(parent: Match, remainingTeams: MutableList<Team>) {
        if (remainingTeams.size < 2) {
            throw Exception("Expected at least 2 teams remaining")
        }

        parent.team1 = remainingTeams.removeLast()
        parent.team2 = remainingTeams.removeLast()
        numberOfRemainingAutoAdvancedTeams -= 2
    }
}