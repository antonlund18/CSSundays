import * as React from "react"
import {ObjectType, User} from "../../codegen/generated-types";
import {Person} from "@mui/icons-material";
import {Divider, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import { useNavigate } from "react-router";
import {useDateFormatter} from "../../hooks/useDateFormatter";

const useStyles = makeStyles(theme => ({
    searchResult: {
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 1)"
        },
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        cursor: "pointer",
    }
}))

type UserSearchResultProps = {
    user: User
}

export const SearchResultUser = (props: UserSearchResultProps) => {
    const {user} = props
    const classes = useStyles()
    const navigate = useNavigate()
    const {formatDate} = useDateFormatter()

    return <div className={classes.searchResult} onClick={() => navigate(`/players/${user.id}`)}>
        <Person color={"primary"} style={{margin: "16px"}}/>
        <Divider flexItem orientation={"vertical"} variant={"fullWidth"}/>
        <img src={getPictureLinkFromKey(user.picture ?? "", ObjectType.User)} style={{width: "40px", aspectRatio: "1/1", objectFit: "cover", marginLeft: "16px"}}/>
        <div style={{display: "flex", flexDirection: "column", marginLeft: "16px"}}>
            <Typography variant={"body2"}>{user.playertag}</Typography>
            <Typography variant={"body1"}>{`Bruger siden ${formatDate(user.createdTs)}`}</Typography>
        </div>
    </div>
}