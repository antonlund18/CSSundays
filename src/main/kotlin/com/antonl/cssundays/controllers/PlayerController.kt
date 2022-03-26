package com.antonl.cssundays.controllers

import com.antonl.cssundays.controllers.dtos.PlayerConverter
import com.antonl.cssundays.controllers.dtos.PlayerDTO
import com.antonl.cssundays.model.Player
import com.antonl.cssundays.services.PlayerService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/players")
class PlayerController(private val playerService: PlayerService) {
    @GetMapping("/slug/{slug}")
    fun getPlayerBySlug(@PathVariable slug: String): PlayerDTO? {
        val player = playerService.findPlayerBySlug(slug)
        return PlayerConverter.toDTO(player)
    }

    @GetMapping("/id/{id}")
    fun getPlayerById(@PathVariable id: Long): PlayerDTO? {
        val player = playerService.findPlayerById(id)
        return PlayerConverter.toDTO(player)
    }

    @PostMapping("/create/{username}/{email}")
    fun createPlayer(@PathVariable username: String, @PathVariable email: String) {
        val player = Player(username = username, email = email)
        playerService.savePlayer(player)
    }

}