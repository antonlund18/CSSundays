import * as React from "react"
import {IconButton, TextField} from "@mui/material";
import {ContentCopy, Search} from "@mui/icons-material";

type SearchQueryProps = {
    searchQuery: string
    setSearchQuery: (query: string) => void
    handleCopy: () => void
}

export const SearchQuery = (props: SearchQueryProps) => {
    const {searchQuery, setSearchQuery, handleCopy} = props

    return <div>
        <TextField style={{width: "100%", backgroundColor: "white"}}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder={"Søg..."}
                   InputProps={{
                       startAdornment: <Search style={{marginRight: "8px"}}/>,
                       endAdornment: <IconButton><ContentCopy onClick={handleCopy}/></IconButton>
        }}/>
    </div>
}