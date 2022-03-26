package com.antonl.cssundays.controllers

import com.antonl.cssundays.controllers.dtos.TeamConverter
import com.antonl.cssundays.controllers.dtos.TeamDTO
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.services.PlayerService
import com.antonl.cssundays.services.TeamService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/teams")
class TeamController(private val teamService: TeamService, private val playerService: PlayerService) {
    @GetMapping("/slug/{slug}")
    fun getTeamBySlug(@PathVariable slug: String): TeamDTO? {
        val team = teamService.findTeamBySlug(slug);
        return TeamConverter.toDTO(team)
    }

    @GetMapping("/id/{id}")
    fun getTeamById(@PathVariable id: Long): TeamDTO? {
        val team = teamService.findTeamById(id)
        return TeamConverter.toDTO(team)
    }

    @PostMapping("/create/{name}/{playerId}")
    fun createTeam(@PathVariable name: String, @PathVariable playerId: Long) {
        val player = playerService.findPlayerById(playerId)
        val team = Team(name = name, owner = player)
        teamService.addPlayerToTeam(player, team)
        playerService.addTeamToPlayer(team, player)
    }

    @PostMapping("/add/{playerId}/{teamId}")
    fun addPlayerToTeam(@PathVariable playerId: Long, @PathVariable teamId: Long) {
        val player = playerService.findPlayerById(playerId)
        val team = teamService.findTeamById(teamId)
        teamService.addPlayerToTeam(player, team)
        playerService.addTeamToPlayer(team, player)
    }
}