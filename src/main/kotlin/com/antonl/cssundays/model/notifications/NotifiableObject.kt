package com.antonl.cssundays.model.notifications

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Inheritance
import javax.persistence.InheritanceType

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class NotifiableObject(
    @Id
    open var id: Int?
)