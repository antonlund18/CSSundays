package com.antonl.cssundays.model.tournaments

import java.util.*

class BracketLeafNodeFinder(val leafNodes: MutableList<Match> = mutableListOf()) : BracketTreeTraverser {
    override fun traverseTree(tree: Bracket) {
        val queue: Queue<Match> = LinkedList()

        tree.root?.let { queue.add(it) }

        while (!queue.isEmpty()) {
            val currentNode = queue.poll()

            currentNode.left?.let { queue.add(it) }
            currentNode.right?.let { queue.add(it) }

            if (currentNode.left == null && currentNode.right == null) {
                leafNodes.add(currentNode)
            }
        }
    }

    fun getParentsOfLeafNodes(): MutableList<Match> {
        val parents = mutableListOf<Match>()
        leafNodes.forEach {
            if (it.parent != null && !parents.contains(it.parent)) {
                parents.add(it.parent!!)
            }
        }
        return parents
    }
}