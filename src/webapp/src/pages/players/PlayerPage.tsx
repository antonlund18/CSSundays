import * as React from "react"
import {useEffect, useState} from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {Badge, Grid, Tab, Tabs} from "@mui/material";
import {useGetCurrentUser, useGetUserById} from "../../hooks/api/useUser";
import {useNavigate, useParams} from "react-router-dom";
import {ProfileTabContent} from "./ProfileTabContent";
import {PlayerTeamsTabContent} from "./PlayerTeamsTabContent";
import {useFindPendingInvitesForPlayer} from "../../hooks/api/useInviteToTeam";

const TABS = {
    0: "",
    1: "#teams",
    2: "#friends",
    3: "#edit",
}

export const PlayerPage = (): JSX.Element => {
    const urlParams = useParams();
    const {user} = useGetUserById(parseInt(urlParams.player ?? ""))
    const [value, setValue] = useState<number>(0)
    const {currentUser} = useGetCurrentUser();
    const isCurrentUser = user?.id === currentUser?.id;
    const navigate = useNavigate()
    const {pendingInvitesForPlayer} = useFindPendingInvitesForPlayer(user?.id ?? -1)
    const shouldShowInviteToTeamBadge = isCurrentUser && pendingInvitesForPlayer && pendingInvitesForPlayer.length > 0

    useEffect(() => {
        Object.keys(TABS).forEach((key, index) => {
            const str = index as keyof typeof TABS
            if (window.location.hash === TABS[str]) {
                setValue(index)
            }
        })
    }, [window.location.hash])

    const handleChangeTab = (event: React.SyntheticEvent, value: number) => {
        setValue(value);
        const str = value as keyof typeof TABS
        navigate(TABS[str])
    };

    if (!user) {
        return <></>
    }

    return <CenteredPage>
        <Grid container spacing={2}>
            <Grid item xs={10}>
                <TabPanel value={value} index={0}>
                    <ProfileTabContent player={user} isCurrentUser={isCurrentUser}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <PlayerTeamsTabContent player={user} isCurrentUser={isCurrentUser}/>
                </TabPanel>
            </Grid>
            <Grid item xs={2} >
                    <Tabs orientation={"vertical"}
                          value={value}
                          onChange={handleChangeTab}
                          centered={false}
                          sx={{"&& .MuiTab-root": {alignItems: "start"}, borderLeft: 1, borderColor: "divider", height: "100%"}}
                          TabIndicatorProps={{sx: {left: 0}}}
                    >
                        <Tab label={"Profil"}/>
                        <Tab label={<Badge badgeContent={shouldShowInviteToTeamBadge ? 1 : 0} color={"secondary"} variant={"dot"}>Hold</Badge>}/>
                        <Tab label={"Venner"}/>
                        <Tab label={"Rediger"}/>
                    </Tabs>
            </Grid>
        </Grid>

    </CenteredPage>
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