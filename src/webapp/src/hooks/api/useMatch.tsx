import {Match, useGetMatchByIdQuery, useGetMatchesByParentIdsQuery} from "../../codegen/generated-types";

export const useGetMatchesByParentIds = (parentIds: number[]) => {
    const {data, loading} = useGetMatchesByParentIdsQuery({
        variables: {
            parentIds
        }
    });
    return {
        matches: data?.getMatchesByParentIds as Match[],
        loading
    }
}

export const useGetMatchById = (matchId: number) => {
    const {data, loading} = useGetMatchByIdQuery({
        variables: {
            matchId
        },
        fetchPolicy: "no-cache"
    });
    return {
        match: data?.getMatchById as Match,
        loading
    }
}