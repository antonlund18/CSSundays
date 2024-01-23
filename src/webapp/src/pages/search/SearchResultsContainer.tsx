import * as React from "react"
import {useEffect, useState} from "react"
import {Searchable, SearchType, useGetSearchResultsLazyQuery} from "../../codegen/generated-types";
import {Typography} from "@mui/material";
import {StartSearch} from "./StartSearch";
import {EmptySearch} from "./EmptySearch";
import {SearchLoading} from "./SearchLoading";
import {useDebounce} from "usehooks-ts";
import {SearchResults} from "./SearchResults";
import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material/styles";

interface StylesProps {
    showScrollbar: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    searchContainer: {
        "&::-webkit-scrollbar": {
            width: "4px"
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1c95f3",
        },
        marginTop: "8px",
        height: "400px",
        overflowY: props => props.showScrollbar ? "scroll" : "hidden"
    }
}))

type SearchResultsContainerProps = {
    searchQuery: string
    searchType: SearchType
}

export const SearchResultsContainer = (props: SearchResultsContainerProps) => {
    const {searchQuery, searchType} = props
    const debouncedQuery = useDebounce<string>(searchQuery, 500)
    const [searchResults, setSearchResults] = useState<Searchable[]>([])
    const [getSearchResults, {loading}] = useGetSearchResultsLazyQuery()

    const isValidSearch = debouncedQuery.length > 2
    const hasData = searchResults.length > 0

    const classes = useStyles({showScrollbar: hasData && isValidSearch})

    useEffect(() => {
        getSearchResults({
            variables: {
                searchQuery: debouncedQuery,
                searchType
            }
        }).then(data => setSearchResults(data.data?.getSearchResults as Searchable[] ?? []))
    }, [debouncedQuery, searchType])

    return <div style={{marginTop: "24px"}}>
        <Typography variant={"h4"} style={{textTransform: "none"}}>Resultater</Typography>
        <div className={classes.searchContainer}>
            {!isValidSearch && <StartSearch/>}
            {loading && <SearchLoading/>}
            {(!hasData && !loading) && <EmptySearch query={searchQuery}/>}
            <SearchResults searchResults={searchResults}/>
        </div>
    </div>
}