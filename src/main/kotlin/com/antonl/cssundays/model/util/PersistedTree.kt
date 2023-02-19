package com.antonl.cssundays.model.util

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@GraphQLIgnore
abstract class PersistedTree<T> (
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    open val id: Int? = -1,

    @OneToOne(cascade = [CascadeType.ALL])
    open var root: T? = null,
) where T: PersistedNodeWithParent<T>