import * as React from "react"
import {ObjectType, Team} from "../../codegen/generated-types";
import {Circle, Group} from "@mui/icons-material";
import {Divider, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useNavigate} from "react-router";
import {useDateFormatter} from "../../hooks/useDateFormatter";
import {getPictureLinkFromKey} from "../../util/StorageHelper";

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

type TeamSearchResultProps = {
    team: Team
}

export const SearchResultTeam = (props: TeamSearchResultProps) => {
    const {team} = props
    const classes = useStyles()
    const navigate = useNavigate()
    const {formatDate} = useDateFormatter()

    return <div className={classes.searchResult} onClick={() => navigate(`/teams/${team.id}`)}>
        <Group color={"primary"} style={{margin: "16px"}}/>
        <Divider flexItem orientation={"vertical"} variant={"fullWidth"}/>
        <img src={getPictureLinkFromKey(team.picture ?? "", ObjectType.Team)}
             style={{width: "40px", aspectRatio: "1/1", objectFit: "cover", marginLeft: "16px"}}/>
        <div style={{display: "flex", flexDirection: "column", marginLeft: "16px"}}>
            <Typography variant={"body2"}>{team.name}</Typography>
            <div style={{display: "flex", alignItems: "center"}}>
                <Typography variant={"body1"}
                            style={{display: "inline"}}>{`Hold oprettet af ${team.owner.playertag}`}</Typography>
                <Circle style={{fontSize: "4px", opacity: "70%", marginLeft: "8px", marginRight: "8px"}}/>
                <Typography variant={"body1"}
                            style={{display: "inline"}}>{`${team.users.length} medlemmer`}</Typography>
                <Circle style={{fontSize: "4px", opacity: "70%", marginLeft: "8px", marginRight: "8px"}}/>
                <Typography variant={"body1"}
                            style={{display: "inline"}}>{formatDate(team.createdTs)}</Typography>
            </div>
        </div>
    </div>
}