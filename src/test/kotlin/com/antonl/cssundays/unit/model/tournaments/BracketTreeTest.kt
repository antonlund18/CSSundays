package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.model.tournaments.*
import org.junit.jupiter.api.Test

internal class BracketTreeTest {

    @Test
    fun generateBracket() {
        val matches = listOf(
            Match(),
            Match(),
            Match(),
            Match(),
            Match(),
            Match(),
            Match()
        )

        val bracketTree = BracketTree(maxNodes = 17)
        BracketTreeNodeInitializer().traverseTree(bracketTree)
        BracketTreeMatchPopulator(matches).traverseTree(bracketTree)
        BracketTreePrinter().traverseTree(bracketTree)
    }
}