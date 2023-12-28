package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.model.tournaments.brackets.matches.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.MatchService

class BracketTeamPopulator(val tournamentRegistrations: List<TournamentRegistration>, val matchService: MatchService) {
    var numberOfRemainingAutoAdvancedTeams = BracketCalculator.numberOfTeamsToAutomaticallyAdvanceFirstRound(tournamentRegistrations.size)

    fun populateTree(tree: Bracket) {
        val parentsOfLeafNodes = BracketLeafNodeFinder().traverseTree(tree).getParentsOfLeafNodes()

        if (parentsOfLeafNodes.isEmpty() && tournamentRegistrations.isNotEmpty()) {
            tree.root?.tournamentRegistration1 = tournamentRegistrations.getOrNull(0)
            tree.root?.tournamentRegistration2 = tournamentRegistrations.getOrNull(1)
            changeMatchPhase(tree.root)
            return
        }

        val remainingTournamentRegistrations = tournamentRegistrations.toMutableList()
        populateMatches(parentsOfLeafNodes, remainingTournamentRegistrations)
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

        val hasTwoTeams = match.tournamentRegistration1 != null && match.tournamentRegistration2 != null
        val hasNoTeams = match.tournamentRegistration1 == null && match.tournamentRegistration2 == null
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