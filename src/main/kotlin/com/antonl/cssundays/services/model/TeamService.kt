package com.antonl.cssundays.services.model

import com.antonl.cssundays.model.Team
import com.antonl.cssundays.model.User
import com.antonl.cssundays.repositories.TeamRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class TeamService(val teamRepository: TeamRepository) {
    fun saveTeam(team: Team) {
        teamRepository.save(team);
    }

    suspend fun createTeam(name: String, owner: User): Team? {
        return withContext(Dispatchers.IO) {
            val team = Team(name = name, owner = owner);
            saveTeam(team)
            team;
        };
    }

    suspend fun findTeamBySlug(slug: String): Team? {
        return withContext(Dispatchers.IO) {
            teamRepository.findTeamBySlug(slug)
        };
    }

    suspend fun findTeamById(id: Int): Team? {
        return withContext(Dispatchers.IO) {
            teamRepository.findTeamById(id)
        };
    }

    suspend fun findAllTeams(): List<Team> {
        return withContext(Dispatchers.IO) {
            teamRepository.findAll()
        }.toList();
    }

    fun addPlayerToTeam(user: User, team: Team) {
        team.users.add(user);
        saveTeam(team);
    }
}