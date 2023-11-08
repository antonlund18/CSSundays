import * as React from "react"
import {useState} from "react"
import {CenteredPage} from "../../components/CenteredPage";
import {Grid, Tab, Tabs, Typography} from "@mui/material";
import {Divider as CSDivider} from "../../components/Divider";
import {useGetCurrentUser, useGetUserById} from "../../hooks/api/useUser";
import {useParams} from "react-router-dom";
import {ProfileTabContent} from "./ProfileTabContent";

export const PlayerPage = (): JSX.Element => {
    const urlParams = useParams();
    const {user} = useGetUserById(parseInt(urlParams.player ?? ""))
    const [value, setValue] = useState<number>(0)
    const {currentUser} = useGetCurrentUser();
    const isCurrentUser = user?.id === currentUser?.id;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if (!user) {
        return <></>
    }

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"} style={{textTransform: "none"}}>{user.playertag}</Typography>
        <CSDivider/>
        <Grid container>
            <Grid item xs={10}>
                <TabPanel value={value} index={0}>
                    <ProfileTabContent player={user} isCurrentUser={isCurrentUser}/>
                </TabPanel>
            </Grid>
            <Grid item xs={2} >
                    <Tabs orientation={"vertical"}
                          value={value}
                          onChange={handleChange}
                          centered={false}
                          sx={{"&& .MuiTab-root": {alignItems: "start"}, borderLeft: 1, borderColor: "divider", alignItems: "start", height: "100%"}}
                          TabIndicatorProps={{
                              sx: {
                                  left: 0
                              }
                          }}
                    >
                        <Tab label={"Profil"}/>
                        <Tab label={"Hold"}/>
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