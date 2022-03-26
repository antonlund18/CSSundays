package com.antonl.cssundays.controllers

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.repositories.PlayerRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/players")
class PlayerController(private val repository: PlayerRepository) {
    @GetMapping("/{slug}")
    fun player(@PathVariable slug: String): Player? {
        return repository.findPlayerBySlug(slug) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @PostMapping("create")
    fun player() {
        val player: Player = Player(username = "abe", email = "aber")
        repository.save(player);
    }
}