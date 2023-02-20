package com.antonl.cssundays.model.tournaments.brackets

class BracketCalculator {
    companion object {
        val POWERS_OF_TWO = generateSequence(1) { it * 2 }

        /*
         * Number of autoadvanced teams is equals to number of registered teams to the nearest power of 2 (ceiling) minus number of registered teams
         *
         * Examples:
         * Number of teams: 5 - Nearest power of 2 (ceil): 8 -> Minus 5 = 3
         * Number of teams: 8 - Nearest power of 2 (ceil): 8 -> Minus 8 = 0
         * Number of teams: 9 - Nearest power of 2 (ceil): 16 -> Minus 9 = 7
         */
        fun numberOfTeamsToAutomaticallyAdvanceFirstRound(numberOfTeams: Int): Int {
            val closestPowerCeiling = POWERS_OF_TWO.find { it >= numberOfTeams } ?: return 0
            return closestPowerCeiling - numberOfTeams
        }

        /*
         * Number of matches is equals to one less than number of teams to the nearest power of 2 (ceiling)
         *
         * Examples:
         * Number of teams: 5 - Nearest power of 2 (ceil): 8 -> Minus 1 = 7
         * Number of teams: 8 - Nearest power of 2 (ceil): 8 -> Minus 1 = 7
         * Number of teams: 9 - Nearest power of 2 (ceil): 16 -> Minus 1 = 15
         */
        fun calculateNumberOfMatchesInBracket(numberOfTeams: Int): Int {
            val closestPowerCeiling = POWERS_OF_TWO.find { it >= numberOfTeams } ?: return 0
            return closestPowerCeiling - 1
        }
    }
}