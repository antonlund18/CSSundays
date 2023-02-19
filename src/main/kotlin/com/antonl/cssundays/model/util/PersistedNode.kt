package com.antonl.cssundays.model.util

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@GraphQLIgnore
abstract class PersistedNode<T>(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    open val id: Int? = -1,

    @OneToOne(cascade = [CascadeType.ALL])
    open var left: T? = null,

    @OneToOne(cascade = [CascadeType.ALL])
    open var right: T? = null
)