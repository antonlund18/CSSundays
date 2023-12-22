package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.brackets.matches.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.MatchService

class BracketTeamPopulator(val teams: List<Team>, val matchService: MatchService) {
    var numberOfRemainingAutoAdvancedTeams = BracketCalculator.numberOfTeamsToAutomaticallyAdvanceFirstRound(teams.size)

    fun populateTree(tree: Bracket) {
        val parentsOfLeafNodes = BracketLeafNodeFinder().traverseTree(tree).getParentsOfLeafNodes()

        if (parentsOfLeafNodes.isEmpty() && teams.isNotEmpty()) {
            tree.root?.team1 = teams.getOrNull(0)
            tree.root?.team2 = teams.getOrNull(1)
            changeMatchPhase(tree.root)
            return
        }

        val remainingTeams = teams.toMutableList()
        populateMatches(parentsOfLeafNodes, remainingTeams)
        initializeMatchPhases(parentsOfLeafNodes)
    }

    private fun initializeMatchPhases(parentsOfLeafNodes: List<Match>) {
        parentsOfLeafNodes.forEach {
            changeMatchPhase(it)
            changeMatchPhase(it.left)
            changeMatchPhase(it.right)
        }
    }

    private fun changeMatchPhase(match: Match?) {
        match ?: return

        val hasTwoTeams = match.team1 != null && match.team2 != null
        val hasNoTeams = match.team1 == null && match.team2 == null
        if (hasTwoTeams) {
            matchService.changeMatchPhase(
                match,
                changeMatchPhaseStrategy = ChangeMatchPhaseStrategy.READY_CHECK_ONE_CAPTAIN_PER_TEAM
            )
        }
        if (hasNoTeams) {
            matchService.changeMatchPhase(
                match,
                changeMatchPhaseStrategy = ChangeMatchPhaseStrategy.CANCELLED
            )
        }
    }


    private fun populateMatches(matches: List<Match>, remainingTeams: MutableList<Team>) {
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

        parent.right?.team1 = remainingTeams.removeLast()
        parent.right?.team2 = remainingTeams.removeLast()
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