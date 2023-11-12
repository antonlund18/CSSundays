package com.antonl.cssundays.model.tournaments.brackets

import java.util.*

class BracketLeafNodeFinder() : BracketTreeTraverser {
    val nodes: MutableList<Match> = mutableListOf()

    override fun traverseTree(tree: Bracket): BracketLeafNodeFinder {
        val queue: Queue<Match> = LinkedList()

        tree.root?.let { queue.add(it) }

        while (!queue.isEmpty()) {
            val currentNode = queue.poll()
            nodes.add(currentNode)

            currentNode.left?.let { queue.add(it) }
            currentNode.right?.let { queue.add(it) }
        }

        return this
    }

    fun getAllNodes(): List<Match> {
        return nodes.toList();
    }

    fun getLeafNodes(): List<Match> {
        return nodes.filter { it.left == null && it.right == null }
    }

    fun getParentsOfLeafNodes(): List<Match> {
        val parents = mutableListOf<Match>()
        val leafNodes = getLeafNodes()
        leafNodes.forEach {
            if (it.parent != null && !parents.contains(it.parent)) {
                parents.add(it.parent!!)
            }
        }
        return parents.toList()
    }
}