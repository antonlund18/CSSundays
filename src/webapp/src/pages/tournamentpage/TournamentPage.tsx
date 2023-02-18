import {useGetTournamentById} from "../../hooks/api/useTournament";
import {useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {CircularProgress, Divider, makeStyles, Tab, Tabs, Typography} from "@material-ui/core";
import React, {useState} from "react";
import {BracketTabContent} from "./tabs/BracketTabContent";
import { InformationTabContent } from "./tabs/InformationTabContent";

const useStyles = makeStyles(theme => ({
    headerSection: {
        backgroundColor: "white",
        marginBottom: theme.spacing(4)
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

export const TournamentPage = () => {
    const classes = useStyles()
    const urlParams = useParams();
    const {tournament} = useGetTournamentById(parseInt(urlParams.tournamentId ?? "-1"))
    const [value, setValue] = useState(0)

    if (!tournament || !tournament.id) {
        return <CircularProgress style={{position: "absolute", left: "50%", top: "50%"}}/>
    }

    const handleChangeTab = (e: React.ChangeEvent<{}>, value: number) => {
        setValue(value)
    }

    return <CenteredPage>
        <div className={classes.headerSection}>
            <div className={classes.header}>
            <Typography variant={"h2"} color={"primary"}>{tournament.name}</Typography>
            <Typography variant={"caption"}>{tournament.teamRegistrations?.length ?? 0} tilmeldte hold</Typography>
            </div>
            <Divider/>
            <Tabs className={classes.tabs} value={value} onChange={handleChangeTab} indicatorColor={"primary"}>
                <Tab label={"Info"} className={classes.tab}/>
                <Tab label={"Bracket"} className={classes.tab}/>
                <Tab label={"Regler"} className={classes.tab}/>
                <Tab label={"Hold"} className={classes.tab}/>
                <Tab label={"Hjælp"} className={classes.tab}/>
            </Tabs>
        </div>
        <TabPanel value={value} index={0}>
            <InformationTabContent tournament={tournament}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
            <BracketTabContent tournament={tournament}/>
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