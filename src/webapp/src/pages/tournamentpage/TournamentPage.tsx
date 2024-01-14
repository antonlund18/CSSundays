import {useGetTournamentById} from "../../hooks/api/useTournament";
import {useNavigate, useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {Button, CircularProgress, Divider, Tab, Tabs, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles"
import React, {useEffect, useState} from "react";
import {BracketTabContent} from "./tabs/BracketTabContent";
import {InformationTabContent} from "./tabs/InformationTabContent";
import {RulesTab} from "./tabs/RulesTab";
import {MediaTab} from "./tabs/MediaTab";
import {TeamsTab} from "./tabs/TeamsTab";
import {BracketContextProvider} from "./tabs/BracketContextProvider";
import {TournamentRegistrationDialog} from "./registration/TournamentRegistrationDialog";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {LoginDialog} from "../../login/LoginDialog";

const useStyles = makeStyles(theme => ({
    headerSection: {
        backgroundColor: "white",
        marginBottom: theme.spacing(4),
        borderRadius: "4px 4px 0px 0px"
    },
    header: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
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
    const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false)
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const {currentUser} = useGetCurrentUser()
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

    const handleOpenRegistrationDialog = () => {
        if (!currentUser) {
            setLoginDialogOpen(true)
        } else {
            setRegistrationDialogOpen(true)
        }
    }

    const numberOfRegisteredTeams = tournament.tournamentRegistrations?.length ?? 0

    return <CenteredPage>
        <div className={classes.headerSection}>
            <div className={classes.header}>
                <div>
                    <Typography variant={"h2"} color={"primary"}>{tournament.name}</Typography>
                    <Typography
                        variant={"caption"}>{numberOfRegisteredTeams} {numberOfRegisteredTeams === 1 ? "tilmeldt" : "tilmeldte"} hold</Typography>
                </div>
                <div>
                    <Button variant={"contained"} onClick={handleOpenRegistrationDialog}>+ Tilmeld</Button>
                </div>
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
            <TeamsTab tournamentRegistrations={tournament.tournamentRegistrations}/>
        </TabPanel>
        <TabPanel value={value} index={4}>
            <MediaTab/>
        </TabPanel>
        <TournamentRegistrationDialog open={registrationDialogOpen} setOpen={setRegistrationDialogOpen} tournament={tournament}/>
        <LoginDialog open={loginDialogOpen} setOpen={setLoginDialogOpen}/>
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