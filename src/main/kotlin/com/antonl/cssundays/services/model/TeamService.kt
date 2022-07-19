package com.antonl.cssundays.services.model

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.model.User
import com.antonl.cssundays.repositories.TeamRepository
import com.antonl.cssundays.services.storage.TeamStorageService
import com.antonl.cssundays.services.storage.UserStorageService
import org.springframework.stereotype.Service
import java.util.*
import javax.transaction.Transactional

@Service
@Transactional
class TeamService(val teamRepository: TeamRepository) {
    fun saveTeam(team: Team) {
        teamRepository.save(team);
    }

    suspend fun createTeam(name: String, owner: User): Team? {
        val team = Team(name = name, owner = owner);
        saveTeam(team)
        return team;
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

    fun addPlayerToTeam(user: User, team: Team) {
        team.users.add(user);
        saveTeam(team);
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
            UserStorageService.deleteImage(team.picture);
            team.picture = "";
            saveTeam(team);
        }
        return team;
    }
}