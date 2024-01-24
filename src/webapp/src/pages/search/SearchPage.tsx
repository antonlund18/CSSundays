import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {SearchQuery} from "./SearchQuery";
import {SearchTypes} from "./SearchTypes";
import {SearchResultsContainer} from "./SearchResultsContainer";
import {SearchType} from "../../codegen/generated-types";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {SnackbarContext} from "../../SnackbarContextProvider";

export const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [searchType, setSearchType] = useState<SearchType>(SearchType.All)
    const urlParams = useParams()
    const navigate = useNavigate()
    const {state} = useLocation()
    const {openSnackbar} = useContext(SnackbarContext)

    const getSearchType = (type: string): SearchType => {
        const searchTypesMap: { value: string, searchType: SearchType }[] = Object.values(SearchType).map(value => {
            return {value: value.toLowerCase(), searchType: value}
        })
        return searchTypesMap.find(e => e.value === type.toLowerCase())?.searchType ?? SearchType.All
    }

    useEffect(() => {
        if (state?.query) {
            setSearchQuery(state.query)
        }
        if (state?.type) {
            setSearchType(state.type)
        }
    }, [state])

    useEffect(() => {
        if (urlParams.searchQuery) {
            setSearchQuery(urlParams.searchQuery)
        }
        if (urlParams.searchType) {
            setSearchType(getSearchType(urlParams.searchType))
        }
    }, [urlParams])

    useEffect(() => {
        if (searchQuery && searchType) {
            updateLocationState()
        }
    }, [searchQuery, searchType])

    const updateLocationState = () => {
        navigate(`/search`, {state: {query: searchQuery, type: searchType}, replace: true})
    }

    const handleCopy = () => {
        const path = `${window.location.hostname}${window.location.port && ':' + window.location.port}/search/${searchType.toLowerCase()}/${searchQuery}`
        navigator.clipboard.writeText(path)
        openSnackbar("Søgning kopieret til udklipsholderen", "info")
    }

    return <CenteredPage>
        <SearchQuery searchQuery={searchQuery ?? ""} setSearchQuery={setSearchQuery} handleCopy={handleCopy}/>
        <SearchTypes searchType={searchType ?? SearchType.All} setSearchType={setSearchType}/>
        <SearchResultsContainer searchQuery={searchQuery ?? ""} searchType={searchType ?? SearchType.All}/>
    </CenteredPage>
}