import * as React from "react"
import {ObjectType, Tournament} from "../../codegen/generated-types";
import {Circle, EmojiEvents} from "@mui/icons-material";
import {Divider, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {useNavigate} from "react-router";
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

type TournamentSearchResultProps = {
    tournament: Tournament
}

export const SearchResultTournament = (props: TournamentSearchResultProps) => {
    const {tournament} = props
    const classes = useStyles()
    const navigate = useNavigate()
    const {formatDateTime} = useDateFormatter()

    return <div className={classes.searchResult} onClick={() => navigate(`/tournaments/${tournament.id}`)}>
        <EmojiEvents color={"primary"} style={{margin: "16px"}}/>
        <Divider flexItem orientation={"vertical"} variant={"fullWidth"}/>
        <img src={getPictureLinkFromKey(tournament.picture ?? "", ObjectType.Tournament)}
             style={{width: "40px", aspectRatio: "1/1", objectFit: "cover", marginLeft: "16px"}}/>
        <div style={{display: "flex", flexDirection: "column", marginLeft: "16px"}}>
            <Typography variant={"body2"}>{tournament.name}</Typography>
            <div style={{display: "flex", alignItems: "center"}}>
                <Typography variant={"body1"}
                            style={{display: "inline"}}>{formatDateTime(tournament.startDateAndTime)}</Typography>
                <Circle style={{fontSize: "4px", opacity: "70%", marginLeft: "8px", marginRight: "8px"}}/>
                <Typography variant={"body1"}
                            style={{display: "inline"}}>{`${tournament.tournamentRegistrations.length} tilmeldte hold`}</Typography>
            </div>
        </div>
    </div>
}