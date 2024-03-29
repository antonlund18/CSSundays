package com.antonl.cssundays.model.tournaments.brackets

import java.util.*

class BracketMatchInitializer(val numberOfMatches: Int) : BracketTreeTraverser {
    override fun traverseTree(tree: Bracket): BracketMatchInitializer {
        val queue: Queue<Match> = LinkedList()
        var count = 0;

        tree.root = Match()
        queue.add(tree.root)
        count++;

        while (!queue.isEmpty()) {
            val currentNode = queue.poll();

            if (count < numberOfMatches) {
                currentNode.left = Match(parent = currentNode)
                queue.add(currentNode.left)
                count++
            }

            if (count < numberOfMatches) {
                currentNode.right = Match(parent = currentNode)
                queue.add(currentNode.right)
                count++
            }
        }

        return this
    }
}