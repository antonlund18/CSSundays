import * as React from "react"
import {SearchType} from "./SearchTypes";

type SearchResultsProps = {
    searchQuery: string
    searchType: SearchType
}

export const SearchResults = (props: SearchResultsProps) => {
    const {searchQuery, searchType} = props

    return <>{searchQuery}</>
}