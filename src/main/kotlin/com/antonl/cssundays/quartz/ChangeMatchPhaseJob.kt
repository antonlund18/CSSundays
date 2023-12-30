package com.antonl.cssundays.quartz

import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.MatchService
import org.quartz.JobExecutionContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.quartz.QuartzJobBean

class ChangeMatchPhaseJob : QuartzJobBean() {
    @Autowired
    private lateinit var matchService: MatchService

    override fun executeInternal(context: JobExecutionContext) {
        val jobDataMap = context.mergedJobDataMap

        val matchId: Int = jobDataMap[ChangeMatchPhaseJobDetailBuilder.MATCH_ID_KEY] as Int
        val strategy: String = jobDataMap[ChangeMatchPhaseJobDetailBuilder.STRATEGY_KEY] as String

        val match = matchService.getMatchById(matchId) ?: return

        matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.valueOf(strategy))
        matchService.saveMatch(match)
    }
}