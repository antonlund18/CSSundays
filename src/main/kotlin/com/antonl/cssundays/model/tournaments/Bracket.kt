package com.antonl.cssundays.model.tournaments

import java.util.*

class Bracket(
    val id: Int?,

    val tournament: Tournament,

    val matches: MutableList<Match> = mutableListOf(),

    val createdTs: Date,


    )