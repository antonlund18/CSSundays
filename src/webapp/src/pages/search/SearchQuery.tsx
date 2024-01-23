import * as React from "react"
import {TextField} from "@mui/material";
import {Search} from "@mui/icons-material";

type SearchQueryProps = {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export const SearchQuery = (props: SearchQueryProps) => {
    const {searchQuery, setSearchQuery} = props

    return <div>
        <TextField style={{width: "100%"}}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   InputProps={{startAdornment: <Search/>}}/>
    </div>
}