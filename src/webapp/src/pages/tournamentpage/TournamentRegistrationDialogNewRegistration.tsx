import * as React from "react"
import {Box, Button, Divider, Tab, Tabs, Typography} from "@mui/material";
import {getPictureLinkFromKey} from "../../util/StorageHelper";
import {ObjectType, Team, Tournament, User} from "../../codegen/generated-types";
import {makeStyles} from "@mui/styles";
import {useState} from "react";
import {useTournaments} from "../../hooks/api/useTournament";

type TournamentRegistrationDialogNewRegistrationProps = {
    tournament: Tournament
    currentUser: User
}

export const TournamentRegistrationDialogNewRegistration = (props: TournamentRegistrationDialogNewRegistrationProps) => {
    const [value, setValue] = useState(0)
    const {registerTeam} = useTournaments()


    const handleRegisterTeam = (team: Team) => {
        if (!props.tournament.id || !team.id || !props.currentUser?.id) {
            return
        }
        registerTeam(props.tournament.id, team.id, props.currentUser.id)
    }

    return <Box>
        <Tabs value={value} sx={{display: "flex", width: "100%"}} onChange={(e, value) => setValue(value)}>
            <Tab label={"Tilmeld som hold"} sx={{flex: 1}}/>
            <Tab label={"Tilmeld som spiller"} sx={{flex: 1}}/>
        </Tabs>
        <TabPanel value={value} index={0}>
            <div style={{padding: "16px"}}>
                {props.currentUser?.teams.map((team, index) => {
                    return <>
                        <div
                            style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <img src={getPictureLinkFromKey(team.picture ?? "", ObjectType.Team)}
                                     style={{width: "32px", aspectRatio: "1/1"}}/>
                                <Typography variant={"h4"} style={{marginLeft: "16px", textTransform: "none"}}>{team.name}</Typography>
                            </div>
                            <Button onClick={() => handleRegisterTeam(team)}>Tilmeld</Button>
                        </div>
                        {props.currentUser?.teams.length != index + 1 && <Divider sx={{marginTop: "8px", marginBottom: "8px"}}/>}
                    </>
                })}
            </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <div style={{padding: "16px"}}>
                Test2
            </div>
        </TabPanel>
    </Box>
}

interface TabPanelProps {
    value: number
    index: number
    children?: React.ReactNode
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
    return <div hidden={props.value !== props.index}>
        {props.value === props.index && props.children}
    </div>
}