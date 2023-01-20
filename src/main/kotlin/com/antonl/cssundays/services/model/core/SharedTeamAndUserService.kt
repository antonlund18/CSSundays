package com.antonl.cssundays.services.model.core

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.repositories.TeamRepository
import com.antonl.cssundays.repositories.UserRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class SharedTeamAndUserService(val userRepository: UserRepository, val teamRepository: TeamRepository) {
    fun saveTeamAndUser(team: Team?, user: User?) {
        if (team == null || user == null) {
            return;
        }
        teamRepository.save(team);
        userRepository.save(user);
    }

    fun addUserToTeam(user: User?, team: Team?) {
        if (user == null || team == null) {
            return;
        }
        if (!team.users.contains(user)) {
            team.users.add(user);
        }
        if (!user.teams.contains(team)) {
            user.teams.add(team);
        }
        saveTeamAndUser(team, user);
    }
}