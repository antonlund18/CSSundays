package com.antonl.cssundays.model.tournaments

class BracketNode(
    var match: Match? = null,
    var left: BracketNode? = null,
    var right: BracketNode? = null
)
