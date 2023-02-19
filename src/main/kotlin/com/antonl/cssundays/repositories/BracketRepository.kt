package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.brackets.Bracket
import org.springframework.data.repository.CrudRepository

interface BracketRepository : CrudRepository<Bracket, String> {
}