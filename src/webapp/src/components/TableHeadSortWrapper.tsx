import * as React from "react"
import {ConditionalWrapper} from "./ConditionalWrapper";
import {TableSortLabel, TableSortLabelProps} from "@mui/material";

type TableHeadSortWrapperProps = {
    condition: boolean
} & TableSortLabelProps

export const TableHeadSortWrapper = (props: React.PropsWithChildren<TableHeadSortWrapperProps>): JSX.Element => {
    return <ConditionalWrapper condition={props.condition}
                               wrapper={() => <TableSortLabel {...props}>{props.children}</TableSortLabel>}>
        <div style={{cursor: "default"}}>
            {props.children}
        </div>
    </ConditionalWrapper>
}