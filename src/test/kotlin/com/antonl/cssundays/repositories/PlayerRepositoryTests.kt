package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.Player
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager

@DataJpaTest
class PlayerRepositoryTests @Autowired constructor(
    val entityManager: TestEntityManager,
    val playerRepository: PlayerRepository
) {

    @Test
    fun `When findPlayerBySlug then return Player`() {
        val player = Player(null, "antonlund", "antonlund95@gmail.com")
        entityManager.persist(player)
        entityManager.flush()
        val found = playerRepository.findPlayerBySlug(player.slug)
        assertThat(found).isEqualTo(player)
    }
}