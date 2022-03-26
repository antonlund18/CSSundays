package com.antonl.cssundays.configurations

import com.antonl.cssundays.repositories.PlayerRepository
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PlayerConfiguration {
    @Bean
    fun databaseInitializer(playerRepository: PlayerRepository) = ApplicationRunner {

    }
}