package com.antonl.cssundays.controllers

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.services.PlayerService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/players")
class PlayerController(private val playerService: PlayerService) {
    @GetMapping("/{slug}")
    fun player(@PathVariable slug: String): Player? {
        return playerService.findPlayerBySlug(slug)
    }

    @PostMapping("/create/{username}/{email}")
    fun player(@PathVariable username: String, @PathVariable email: String) {
        val player = Player(username = username, email = email)
        playerService.savePlayer(player)
    }
}