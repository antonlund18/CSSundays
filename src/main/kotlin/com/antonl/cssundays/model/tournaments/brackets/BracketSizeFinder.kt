package com.antonl.cssundays.model.tournaments.brackets

import java.util.*

class BracketSizeFinder : BracketTreeTraverser {
    var size: Int = 0

    override fun traverseTree(tree: Bracket): BracketSizeFinder {
        val queue: Queue<Match> = LinkedList()

        tree.root?.let { queue.add(it) }

        while (!queue.isEmpty()) {
            val currentNode = queue.poll()
            size++

            currentNode.left?.let { queue.add(it) }
            currentNode.right?.let { queue.add(it) }
        }

        return this
    }
}