package com.antonl.cssundays.model.tournaments

import java.util.*

class BracketMatchInitializer(val numberOfMatches: Int) : BracketTreeTraverser {
    override fun traverseTree(tree: Bracket) {
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
    }
}