package com.antonl.cssundays.model.tournaments.brackets

class BracketTreePrinter : BracketTreeTraverser {
    override fun traverseTree(tree: Bracket): BracketTreePrinter {
        var currentLevel: MutableList<Match> = mutableListOf()

        tree.root?.let { currentLevel.add(it) }

        while (!currentLevel.isEmpty()) {
            val nextLevel: MutableList<Match> = mutableListOf()

            for (node in currentLevel) {
                var teamsInMatch = 0

                node.tournamentRegistration1?.let { teamsInMatch++ }
                node.tournamentRegistration2?.let { teamsInMatch++ }

                print("${teamsInMatch} ")

                node.left?.let { nextLevel.add(it) }
                node.right?.let { nextLevel.add(it) }
            }

            println("")
            currentLevel = nextLevel
        }

        return this
    }
}