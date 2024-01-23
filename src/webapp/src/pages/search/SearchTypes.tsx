import * as React from "react"
import {SearchTypePicker} from "./SearchTypePicker";
import {SearchType} from "../../codegen/generated-types";

type SearchTypesProps = {
    searchType: SearchType
    setSearchType: (searchType: SearchType) => void
}

export const SearchTypes = (props: SearchTypesProps) => {
    const {searchType, setSearchType} = props

    return <>
        <div style={{
            display: "flex",
            marginTop: "24px",
            justifyContent: "space-between",
        }}>
            <SearchTypePicker searchType={SearchType.All} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
            <SearchTypePicker searchType={SearchType.Players} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
            <SearchTypePicker searchType={SearchType.Teams} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
            <SearchTypePicker searchType={SearchType.Tournaments} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
        </div></>
}