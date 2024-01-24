import * as React from "react"
import {AutoAwesomeMosaic, EmojiEvents, Group, Person} from "@mui/icons-material";
import {Radio, Theme, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {SearchType} from "../../codegen/generated-types";

interface StylesProps {
    isSelected: boolean
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    container: {
        "&:hover": {
            opacity: "100%",
        },
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        border: `2px solid ${theme.palette.primary.main}`,
        opacity: props => (props.isSelected ? "100%" : "40%"),
        borderRadius: "4px",
        width: "24%",
        cursor: "pointer",
        backgroundColor: "white"
    }
}))

type SearchTypePickerProps = {
    searchType: SearchType
    searchTypeValue: SearchType
    setSearchTypeValue: (search: SearchType) => void
}

export const SearchTypePicker = (props: SearchTypePickerProps) => {
    const {searchType, searchTypeValue, setSearchTypeValue} = props

    const isSelected = searchType === searchTypeValue
    const classes = useStyles({isSelected})

    const getIcon = () => {
        switch (searchType) {
            case SearchType.All:
                return <AutoAwesomeMosaic style={{marginRight: "16px"}} color={"primary"}/>
            case SearchType.Players:
                return <Person style={{marginRight: "16px"}} color={"primary"}/>
            case SearchType.Teams:
                return <Group style={{marginRight: "16px"}} color={"primary"}/>
            case SearchType.Tournaments:
                return <EmojiEvents style={{marginRight: "16px"}} color={"primary"}/>
        }
    }

    return <div className={classes.container} onClick={() => setSearchTypeValue(searchType)}
    >
        <div style={{display: "flex", alignItems: "center"}}>
            <Radio checked={isSelected}/>
            <Typography variant={"h4"}>{searchType}</Typography>
        </div>
        {getIcon()}
    </div>
}