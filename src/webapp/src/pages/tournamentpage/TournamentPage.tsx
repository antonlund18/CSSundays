import {useGetTournamentById} from "../../hooks/api/useTournament";
import {useNavigate, useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {CircularProgress, Divider, Tab, Tabs, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import React, {useEffect, useState} from "react";
import {BracketTabContent} from "./tabs/BracketTabContent";
import {InformationTabContent} from "./tabs/InformationTabContent";
import {RulesTab} from "./tabs/RulesTab";
import {MediaTab} from "./tabs/MediaTab";
import {TeamsTab} from "./tabs/TeamsTab";
import {BracketContextProvider} from "./tabs/BracketContextProvider";

const useStyles = makeStyles(theme => ({
    headerSection: {
        backgroundColor: "white",
        marginBottom: theme.spacing(4),
        borderRadius: "4px 4px 0px 0px"
    },
    header: {
        padding: theme.spacing(2),
    },
    tabs: {
        display: "flex",
    },
    tab: {
        flexGrow: 2,
        maxWidth: "none"
    }
}))

const TABS = {
    0: "",
    1: "#bracket",
    2: "#rules",
    3: "#teams",
    4: "#media",
    5: "#help"
}

export const TournamentPage = () => {
    const classes = useStyles()
    const urlParams = useParams();
    const {tournament} = useGetTournamentById(parseInt(urlParams.tournamentId ?? "-1"))
    const [value, setValue] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        Object.keys(TABS).forEach((key, index) => {
            const str = index as keyof typeof TABS
            if (window.location.hash === TABS[str]) {
                setValue(index)
            }
        })
    }, [window.location.hash])

    if (!tournament || !tournament.id) {
        return <CircularProgress style={{position: "absolute", left: "50%", top: "50%"}}/>
    }

    const handleChangeTab = (e: React.ChangeEvent<{}>, value: number) => {
        setValue(value)
        const str = value as keyof typeof TABS
        navigate(TABS[str])
    }

    const numberOfRegisteredTeams = tournament.teamRegistrations?.length ?? 0

    return <CenteredPage>
        <div className={classes.headerSection}>
            <div className={classes.header}>
                <Typography variant={"h2"} color={"primary"}>{tournament.name}</Typography>
                <Typography
                    variant={"caption"}>{numberOfRegisteredTeams} {numberOfRegisteredTeams === 1 ? "tilmeldt" : "tilmeldte"} hold</Typography>
            </div>
            <Divider/>
            <Tabs className={classes.tabs} value={value} onChange={handleChangeTab} indicatorColor={"primary"}>
                <Tab label={"Info"} className={classes.tab}/>
                <Tab label={"Bracket"} className={classes.tab}/>
                <Tab label={"Regler"} className={classes.tab}/>
                <Tab label={"Hold"} className={classes.tab}/>
                <Tab label={"Se med"} className={classes.tab}/>
                <Tab label={"Hjælp"} className={classes.tab}/>
            </Tabs>
        </div>
        <TabPanel value={value} index={0}>
            <InformationTabContent tournament={tournament}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <BracketContextProvider>
                <BracketTabContent tournament={tournament}/>
            </BracketContextProvider>
        </TabPanel>
        <TabPanel value={value} index={2}>
            <RulesTab tournament={tournament}/>
        </TabPanel>
        <TabPanel value={value} index={3}>
            <TeamsTab tournamentRegistrations={tournament.teamRegistrations}/>
        </TabPanel>
        <TabPanel value={value} index={4}>
            <MediaTab/>
        </TabPanel>
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