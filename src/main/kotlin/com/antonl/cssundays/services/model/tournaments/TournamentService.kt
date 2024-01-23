package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentFormat
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.model.tournaments.brackets.*
import com.antonl.cssundays.repositories.TournamentRepository
import com.antonl.cssundays.services.storage.TournamentStorageService
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional

@Service
@Transactional
class TournamentService(
    val tournamentRepository: TournamentRepository,
    val tournamentRegistrationService: TournamentRegistrationService,
    val matchService: MatchService,
) {
    @PersistenceContext
    private var entityManager: EntityManager? = null

    fun saveTournament(tournament: Tournament): Tournament {
        return tournamentRepository.save(tournament)
    }

    fun getAllTournaments(): List<Tournament> {
        return tournamentRepository.findAll().toList()
    }

    fun findTournamentByName(name: String): Tournament? {
        return tournamentRepository.findTournamentByName(name)
    }

    fun findTournamentsByName(name: String): List<Tournament> {
        return tournamentRepository.findTournamentsByName(name)
    }

    fun createTournament(name: String, date: LocalDateTime, numberOfTeamsAllowed: Int, format: TournamentFormat = TournamentFormat.SINGLE_ELIMINATION, picture: String? = null, description: String = "", rules: String = ""): Tournament {
        val tournament = Tournament(
            name = name,
            startDateAndTime = date,
            numberOfTeamsAllowed = numberOfTeamsAllowed,
            picture = picture,
            description = description,
            rules = rules
        )
        saveTournament(tournament)
        return tournament
    }

    suspend fun setPicture(tournament: Tournament): RequestDTO {
        deletePicture(tournament);
        val imageKey = UUID.randomUUID().toString() + ".jpg";
        tournament.picture = imageKey;
        saveTournament(tournament)
        return TournamentStorageService().getPresignedUploadRequest(imageKey);
    }

    suspend fun deletePicture(tournament: Tournament): Tournament? {
        if (!tournament.picture.equals(null)) {
            TournamentStorageService().deleteImage(tournament.picture);
            tournament.picture = null;
            saveTournament(tournament);
        }
        return tournament;
    }

    fun getTournamentById(id: Int): Tournament? {
        return tournamentRepository.findById(id)
    }

    fun publishTournament(tournament: Tournament): Tournament? {
        tournament.published = true
        return saveTournament(tournament)
    }

    fun removePublication(tournament: Tournament): Tournament? {
        tournament.published = false
        return saveTournament(tournament)
    }

    fun generateBracket(tournament: Tournament): Tournament {
        val bracket = createBracket(tournament)
        val registeredTeams = tournamentRegistrationService.getRegisteredTeams(tournament)
        val numberOfMatches = calculateNumberOfMatches(registeredTeams.size)

        BracketMatchInitializer(numberOfMatches).traverseTree(bracket)
        BracketTeamPopulator(tournament.tournamentRegistrations).populateTree(bracket)

        entityManager?.let { it.flush() }

        BracketMatchPhaseInitializer(matchService).initializeMatchPhases(bracket)
        return saveTournament(tournament)
    }

    fun getFirstRoundMatches(tournament: Tournament): List<Match> {
        val bracket = tournament.bracket ?: return listOf()
        return BracketLeafNodeFinder().traverseTree(bracket).getLeafNodes()
    }

    fun createBracket(tournament: Tournament): Bracket {
        val bracket = Bracket(tournament)
        tournament.bracket = bracket
        return bracket
    }

    fun getBracketSize(bracket: Bracket): Int {
        return BracketSizeFinder().traverseTree(bracket).size
    }

    fun calculateNumberOfMatches(numberOfTeams: Int): Int {
        return BracketCalculator.calculateNumberOfMatchesInBracket(numberOfTeams)
    }

    fun getTournamentRegistrationByPlayer(tournament: Tournament, player: User): TournamentRegistration? {
        return tournamentRegistrationService.getTournamentRegistrationByPlayer(tournament, player)
    }

    fun getTournamentRegistrationByTeam(tournament: Tournament, team: Team): TournamentRegistration? {
        return tournamentRegistrationService.getTournamentRegistrationByTeam(tournament, team)
    }
}