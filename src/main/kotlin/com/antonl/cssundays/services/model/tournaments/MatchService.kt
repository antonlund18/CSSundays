package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.tournaments.Match

class MatchService {
    fun createMatches(amount: Int): List<Match> {
        val matches = mutableListOf<Match>()
        for (i in 1.rangeTo(amount)) {
            matches.add(Match(team1 = null, team2 = null))
        }
        return matches;
    }
}