package com.antonl.cssundays.model.tournaments

import java.util.*

class BracketTreeMatchPopulator(val matches: List<Match>) : BracketTreeTraverser {
    override fun traverseTree(tree: BracketTree) {
        val queue: Queue<BracketNode> = LinkedList()
        val matches: Queue<Match> = LinkedList(matches)

        queue.add(tree.root)

        while (!queue.isEmpty()) {
            val currentNode: BracketNode = queue.poll()
            val currentMatch = matches.poll()
            currentNode.match = currentMatch

            if (currentNode.left != null) {
                queue.add(currentNode.left)
            }

            if (currentNode.right != null) {
                queue.add(currentNode.right)
            }
        }
    }
}