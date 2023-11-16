import * as React from "react"
import {User} from "../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {ProfileTabHeaderSection} from "./ProfileTabHeaderSection";
import {ProfileTabSocialSection} from "./ProfileTabSocialSection";
import {ProfileTabInformationSection} from "./ProfileTabInformationSection";
import {useDateFormatter} from "../../hooks/useDateFormatter";

type ProfileTabContentProps = {
    player: User
    isCurrentUser: boolean
}

export const ProfileTabContent = (props: ProfileTabContentProps): JSX.Element => {
    const {formatDate} = useDateFormatter()

    return <>
        <Grid container spacing={4}>
            <ProfileTabHeaderSection player={props.player} isCurrentUser={props.isCurrentUser}/>

            <Grid item xs={12}>
                <Typography>{"Bruger siden " + formatDate(props.player.createdTs)}</Typography>
            </Grid>

            <ProfileTabSocialSection player={props.player}/>
        </Grid>
    </>
}