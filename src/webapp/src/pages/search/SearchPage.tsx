import * as React from "react"
import {useState} from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {SearchQuery} from "./SearchQuery";
import {SearchTypes} from "./SearchTypes";
import {SearchResultsContainer} from "./SearchResultsContainer";
import {SearchType} from "../../codegen/generated-types";

export const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [searchType, setSearchType] = useState<SearchType>(SearchType.All)

    return <CenteredPage>
        <SearchQuery searchQuery={searchQuery ?? ""} setSearchQuery={setSearchQuery}/>
        <SearchTypes searchType={searchType ?? SearchType.All} setSearchType={setSearchType}/>
        <SearchResultsContainer searchQuery={searchQuery ?? ""} searchType={searchType ?? SearchType.All}/>
    </CenteredPage>
}