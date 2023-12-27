package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class MatchQueries : Query {
    @Autowired
    private lateinit var matchService: MatchService

    fun getMatchesByParentIds(parentIds: List<Int>): List<Match> {
        return matchService.getMatchesByParentIds(parentIds)
    }

    fun getMatchById(matchId: Int): Match? {
        return matchService.getMatchById(matchId)
    }
}