package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match

interface ChangeMatchPhaseStrategyHandler {
    fun execute(match: Match)
}