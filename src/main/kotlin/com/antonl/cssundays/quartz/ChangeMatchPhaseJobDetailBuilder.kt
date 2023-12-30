package com.antonl.cssundays.quartz

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import org.quartz.JobBuilder
import org.quartz.JobDataMap
import org.quartz.JobDetail
import java.util.*

class ChangeMatchPhaseJobDetailBuilder(val match: Match, val strategy: ChangeMatchPhaseStrategy) {
    companion object {
        val GROUP: String = "CHANGE_MATCH_PHASE_JOBS"
        val MATCH_ID_KEY: String = "MATCH_ID"
        val STRATEGY_KEY: String = "STRATEGY"
    }

    fun build(): JobDetail {
        return JobBuilder.newJob(ChangeMatchPhaseJob::class.java)
            .withIdentity(UUID.randomUUID().toString(), GROUP)
            .withDescription("Change match phase")
            .usingJobData(getJobData())
            .storeDurably()
            .build()
    }

    fun getJobData(): JobDataMap {
        val jobDataMap = JobDataMap()
        jobDataMap.put(MATCH_ID_KEY, match.id)
        jobDataMap.put(STRATEGY_KEY, strategy.toString())
        return jobDataMap
    }
}