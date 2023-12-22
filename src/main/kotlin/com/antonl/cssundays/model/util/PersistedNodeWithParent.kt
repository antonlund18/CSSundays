package com.antonl.cssundays.model.util

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@GraphQLIgnore
abstract class PersistedNodeWithParent<T> (
    @OneToOne(cascade = [CascadeType.ALL])
    open var parent: T? = null
) : PersistedNode<T>() where T: PersistedNode<T>
