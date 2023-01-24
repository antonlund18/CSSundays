package com.antonl.cssundays.model.tournaments

import java.util.*

class BracketTreeNodeInitializer : BracketTreeTraverser {
    override fun traverseTree(tree: BracketTree) {
        val queue: Queue<BracketNode> = LinkedList()
        var count = 0;

        tree.root = BracketNode()
        queue.add(tree.root)
        count++;

        while (!queue.isEmpty()) {
            val currentNode = queue.poll();

            if (count < tree.maxNodes) {
                currentNode.left = BracketNode()
                queue.add(currentNode.left)
                count++
            }

            if (count < tree.maxNodes) {
                currentNode.right = BracketNode()
                queue.add(currentNode.right)
                count++
            }
        }
    }
}