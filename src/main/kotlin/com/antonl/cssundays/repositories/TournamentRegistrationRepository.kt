package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.TournamentRegistration
import org.springframework.data.repository.CrudRepository

interface TournamentRegistrationRepository : CrudRepository<TournamentRegistration, String> {
}