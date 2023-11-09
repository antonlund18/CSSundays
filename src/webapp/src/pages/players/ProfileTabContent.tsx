import * as React from "react"
import {User} from "../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {ProfileTabHeaderSection} from "./ProfileTabHeaderSection";
import {ProfileTabSocialSection} from "./ProfileTabSocialSection";
import {ProfileTabInformationSection} from "./ProfileTabInformationSection";

type ProfileTabContentProps = {
    player: User
    isCurrentUser: boolean
}

export const ProfileTabContent = (props: ProfileTabContentProps): JSX.Element => {
    return <>
        <Grid container spacing={4}>
            <ProfileTabHeaderSection player={props.player} isCurrentUser={props.isCurrentUser}/>
            <Grid item container xs={12} spacing={2}>
                <ProfileTabInformationSection player={props.player}/>
                <ProfileTabSocialSection player={props.player}/>
            </Grid>
        </Grid>
    </>
}