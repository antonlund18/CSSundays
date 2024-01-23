package com.antonl.cssundays.services.model.search

import com.antonl.cssundays.model.search.SearchType
import com.antonl.cssundays.model.search.Searchable
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SearchService {
    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var tournamentService: TournamentService

    suspend fun getSearchResult(searchQuery: String, searchType: SearchType): List<Searchable> {
        return when (searchType) {
            SearchType.ALL -> getAllSearchResults(searchQuery)
            SearchType.PLAYERS -> userService.findUsersByPlayertag(searchQuery)
            SearchType.TEAMS -> teamService.findTeamsByName(searchQuery)
            SearchType.TOURNAMENTS -> tournamentService.findTournamentsByName(searchQuery)
        }
    }

    private suspend fun getAllSearchResults(searchQuery: String): List<Searchable> {
        val users = userService.findUsersByPlayertag(searchQuery)
        val teams = teamService.findTeamsByName(searchQuery)
        val tournaments = tournamentService.findTournamentsByName(searchQuery)
        return listOf(*users.toTypedArray(), *teams.toTypedArray(), *tournaments.toTypedArray())
    }
}