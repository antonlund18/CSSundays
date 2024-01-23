import * as React from "react"
import {useState} from "react"
import {SearchTypePicker} from "./SearchTypePicker";

export enum SearchType {
    ALL = "ALL",
    PLAYERS = "PLAYERS",
    TEAMS = "TEAMS",
    TOURNAMENTS = "TOURNAMENTS",
}

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
            <SearchTypePicker searchType={SearchType.ALL} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
            <SearchTypePicker searchType={SearchType.PLAYERS} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
            <SearchTypePicker searchType={SearchType.TEAMS} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
            <SearchTypePicker searchType={SearchType.TOURNAMENTS} searchTypeValue={searchType} setSearchTypeValue={setSearchType}/>
        </div></>
}