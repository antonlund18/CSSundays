package com.antonl.cssundays.model.tournaments

import java.util.*

class BracketTreePrinter : BracketTreeTraverser {
    override fun traverseTree(tree: BracketTree) {
        var currentLevel: MutableList<BracketNode> = mutableListOf()

        tree.root?.let { currentLevel.add(it) }

        while (!currentLevel.isEmpty()) {
            val nextLevel: MutableList<BracketNode> = mutableListOf()

            for (node in currentLevel) {
                print("o ")

                node.left?.let { nextLevel.add(it) }
                node.right?.let { nextLevel.add(it) }
            }

            println("")
            currentLevel = nextLevel
        }
    }
}