package com.antonl.cssundays.controllers

import com.antonl.cssundays.model.Team
import com.antonl.cssundays.repositories.TeamRepository
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable


@Controller
class TeamController(private val repository: TeamRepository) {
    @GetMapping("/teams/{slug}")
    fun player(@PathVariable slug: String): Team? {
        return repository.findTeamBySlug(slug);
    }
}