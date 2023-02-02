package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.Match
import org.springframework.data.repository.CrudRepository

interface MatchRepository : CrudRepository<Match, String> {
}