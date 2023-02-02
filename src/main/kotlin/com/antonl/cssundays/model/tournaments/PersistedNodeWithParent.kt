package com.antonl.cssundays.model.tournaments

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@GraphQLIgnore
abstract class PersistedNodeWithParent<T> (
    @OneToOne
    open var parent: T? = null
) : PersistedNode<T>() where T: PersistedNode<T>
