package com.antonl.cssundays.quartz

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.ChangeMatchPhaseStrategy
import org.quartz.JobDetail
import org.quartz.Scheduler
import org.quartz.Trigger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ScheduledChangeMatchPhaseService(@Autowired val scheduler: Scheduler) {

    fun scheduleChangeMatchPhase(match: Match, strategy: ChangeMatchPhaseStrategy, time: LocalDateTime) {
        val job = buildJob(match, strategy)
        val trigger = buildTrigger(job, time)
        scheduler.scheduleJob(job, trigger)
    }

    private fun buildJob(match: Match, strategy: ChangeMatchPhaseStrategy): JobDetail {
        return ChangeMatchPhaseJobDetailBuilder(match, strategy).build()
    }

    private fun buildTrigger(jobDetail: JobDetail, executionTime: LocalDateTime): Trigger {
        return ChangeMatchPhaseJobTriggerBuilder(jobDetail, executionTime).build()
    }
}