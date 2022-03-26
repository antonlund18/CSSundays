package com.antonl.cssundays.services

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.repositories.TeamRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class TeamService(val teamRepository: TeamRepository) {
    fun saveTeam(team: Team) {
        teamRepository.save(team);
    }

    fun findTeamBySlug(slug: String): Team {
        return teamRepository.findTeamBySlug(slug);
    }

    fun findTeamById(id: Long): Team {
        return teamRepository.findTeamById(id);
    }

    fun findAllTeams(): List<Team> {
        return teamRepository.findAll().toList();
    }

    fun addPlayerToTeam(player: Player, team: Team) {
        team.players.add(player);
        saveTeam(team);
    }
}