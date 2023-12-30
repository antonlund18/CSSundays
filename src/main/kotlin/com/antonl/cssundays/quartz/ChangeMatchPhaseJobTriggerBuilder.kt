package com.antonl.cssundays.quartz

import org.quartz.JobDetail
import org.quartz.SimpleScheduleBuilder
import org.quartz.Trigger
import org.quartz.TriggerBuilder
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*

class ChangeMatchPhaseJobTriggerBuilder(val jobDetail: JobDetail, val executionTime: LocalDateTime) {
    fun build(): Trigger {
        return TriggerBuilder.newTrigger()
            .forJob(jobDetail)
            .withIdentity(jobDetail.key.name, jobDetail.key.group)
            .startAt(Date.from(executionTime.toInstant(ZoneOffset.UTC)))
            .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
            .build()
    }
}