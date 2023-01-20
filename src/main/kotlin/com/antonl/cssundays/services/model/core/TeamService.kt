package com.antonl.cssundays.services.model.core

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.repositories.TeamRepository
import com.antonl.cssundays.services.storage.TeamStorageService
import org.springframework.stereotype.Service
import java.util.*
import javax.transaction.Transactional

@Service
@Transactional
class TeamService(val teamRepository: TeamRepository) {
    fun saveTeam(team: Team): Team {
        return teamRepository.save(team);
    }

    fun createTeam(name: String, owner: User): Team {
        val team = Team(name = name, owner = owner);
        return saveTeam(team);
    }

    suspend fun findTeamBySlug(slug: String): Team? {
        return teamRepository.findTeamBySlug(slug)
    }

    suspend fun findTeamById(id: Int): Team? {
        return teamRepository.findTeamById(id)
    }

    suspend fun findAllTeams(): List<Team> {
        return teamRepository.findAll().toList()
    }

    fun addPlayerToTeam(user: User?, team: Team?) {
        if (team == null || user == null) {
            return;
        }
        if (!team.users.contains(user)) {
            team.users.add(user);
            saveTeam(team);
        }

    }

    fun incrementWins(team: Team) {
        team.wins++;
        saveTeam(team);
    }

    fun incrementLosses(team: Team) {
        team.losses++;
        saveTeam(team);
    }

    suspend fun setPicture(team: Team): RequestDTO {
        deletePicture(team);
        val imageKey = UUID.randomUUID().toString() + ".jpg";
        team.picture = imageKey;
        saveTeam(team)
        return TeamStorageService.getPresignedUploadRequest(imageKey);
    }

    suspend fun deletePicture(team: Team): Team? {
        if (!team.picture.equals("")) {
            TeamStorageService.deleteImage(team.picture);
            team.picture = "";
            saveTeam(team);
        }
        return team;
    }
}