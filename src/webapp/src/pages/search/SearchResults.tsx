import * as React from "react"
import {Searchable, Team, Tournament, User} from "../../codegen/generated-types";
import {SearchResultUser} from "./SearchResultUser";
import {SearchResultTeam} from "./SearchResultTeam";
import {SearchResultTournament} from "./SearchResultTournament";

type SearchResultsProps = {
    searchResults: Searchable[]
}

export const SearchResults = (props: SearchResultsProps) => {
    const {searchResults} = props

    return <>
        {searchResults.map(result => {
            switch (result.__typename) {
                case "User":
                    return <SearchResultUser user={result as User}/>
                case "Team":
                    return <SearchResultTeam team={result as Team}/>
                case "Tournament":
                    return <SearchResultTournament tournament={result as Tournament}/>
            }
        })}
    </>
}