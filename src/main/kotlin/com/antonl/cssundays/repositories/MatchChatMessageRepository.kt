package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.tournaments.brackets.matches.MatchChatMessage
import org.springframework.data.repository.CrudRepository

interface MatchChatMessageRepository : CrudRepository<MatchChatMessage, Int>