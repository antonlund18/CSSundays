import * as React from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {SearchQuery} from "./SearchQuery";
import {SearchType, SearchTypes} from "./SearchTypes";
import {SearchResults} from "./SearchResults";
import {useState} from "react";

export const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchType, setSearchType] = useState(SearchType.ALL)

    return <CenteredPage>
        <SearchQuery searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <SearchTypes searchType={searchType} setSearchType={setSearchType}/>
        <SearchResults searchQuery={searchQuery} searchType={searchType}/>
    </CenteredPage>
}