import * as React from "react"
import {Divider, Grid, Typography} from "@mui/material";
import {User} from "../../codegen/generated-types";
import {useDateFormatter} from "../../hooks/useDateFormatter";

type ProfileTabInformationSectionProps = {
    player: User
}

export const ProfileTabInformationSection = (props: ProfileTabInformationSectionProps): JSX.Element => {
    const {formatDate} = useDateFormatter()

    return <Grid item xs={4}>
        <Typography>{"Bruger siden " + formatDate(props.player.createdTs)}</Typography>
    </Grid>
}