package com.antonl.cssundays.model.notifications

import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class NotifiableObject(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    open var id: Int? = null
)