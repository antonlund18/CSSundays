import * as React from "react"
import {useState} from "react"
import {User} from "../../../codegen/generated-types";
import {Grid, Typography} from "@mui/material";
import {ProfileTabHeaderSection} from "./ProfileTabHeaderSection";
import {ProfileTabSocialSection} from "./ProfileTabSocialSection";
import {useDateFormatter} from "../../../hooks/useDateFormatter";
import {PlayerInviteDialog} from "../PlayerInviteDialog";

type ProfileTabContentProps = {
    player: User
    isCurrentUser: boolean
}

export const ProfileTabContent = (props: ProfileTabContentProps): JSX.Element => {
    const {formatDate} = useDateFormatter()
    const [dialogOpen, setDialogOpen] = useState(false)

    return <>
        <Grid container spacing={4}>
            <ProfileTabHeaderSection player={props.player} isCurrentUser={props.isCurrentUser} setDialogOpen={setDialogOpen}/>

            <ProfileTabSocialSection player={props.player}/>

            <Grid item xs={12}>
                <div style={{display: "flex", justifyContent: "start"}}>
                    <Typography variant={"subtitle2"}>{"Bruger siden " + formatDate(props.player.createdTs)}</Typography>
                </div>
            </Grid>

            <PlayerInviteDialog open={dialogOpen} setOpen={setDialogOpen} targetPlayer={props.player}/>
        </Grid>
    </>
}