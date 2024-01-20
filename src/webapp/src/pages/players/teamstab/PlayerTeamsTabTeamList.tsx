import * as React from "react"
import {useMemo, useState} from "react"
import {SortDirection, SortOption} from "../../../components/SortTypes";
import {HeadCell} from "../../../components/TableTypes";
import {Grid, InputAdornment, TextField, Typography} from "@mui/material";
import {Search} from "@mui/icons-material";
import {ObjectType, User} from "../../../codegen/generated-types";
import {useTeamSort} from "../../../hooks/useTeamSort";
import {getPictureLinkFromKey} from "../../../util/StorageHelper";
import {useNavigate} from "react-router-dom";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
    team: {
        "&:hover": {
            color: theme.palette.primary.main
        },
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        padding: "8px",
    }
}))

type PlayerTeamsTabTeamListProps = {
    player: User
}

export const PlayerTeamsTabTeamList = (props: PlayerTeamsTabTeamListProps): JSX.Element => {
    const {teams} = props.player
    const [searchText, setSearchText] = useState<string>("")
    const navigate = useNavigate()
    const classes = useStyles()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    const filteredTeams = useMemo(() => {
        return teams.slice().filter(team => team.name.toLowerCase().includes(searchText.toLowerCase()))
    }, [teams, searchText])

    return <>
        <Grid item xs={12}>
            <Typography variant={"h2"}>Hold</Typography>
        </Grid>

        <Grid item xs={12}>
            <TextField style={{width: "100%"}}
                       InputProps={{startAdornment: <InputAdornment position={"start"}><Search/></InputAdornment>}}
                       placeholder={"Søg efter hold..."}
                       onChange={handleSearch}
            />
        </Grid>

        <Grid item xs={12} style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            flexWrap: "wrap",
            flexDirection: "row",
            width: "100%",
            overflow: "",
            justifyContent: "space-between",
        }}>
            {filteredTeams.map((team, index) => {
                return <div className={classes.team} onClick={() => navigate(`/teams/${team.id}`)}>
                    <img src={getPictureLinkFromKey(team.picture ?? "", ObjectType.Team)}
                         style={{
                             width: "80%",
                             objectFit: "cover",
                             aspectRatio: "1/1",
                         }}
                    />
                    <Typography variant={"h4"} style={{marginTop: "4px"}}>{team.name}</Typography>
                </div>
            })}
        </Grid>
    </>
}