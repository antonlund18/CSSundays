package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.search.SearchType
import com.antonl.cssundays.model.search.Searchable
import com.antonl.cssundays.services.model.search.SearchService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class SearchQueries : Query {
    @Autowired
    private lateinit var searchService: SearchService

     suspend fun getSearchResults(searchQuery: String, searchType: SearchType): List<Searchable> {
         if (searchQuery.length < 3) return listOf()
         return searchService.getSearchResult(searchQuery, searchType)
     }
}