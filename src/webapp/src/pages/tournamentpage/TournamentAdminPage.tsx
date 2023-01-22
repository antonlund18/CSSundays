import {CenteredPage} from "../../components/CenteredPage";
import {Box, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
import {Divider as CSDivider} from "../../components/Divider";
import * as React from "react";
import {useGetCurrentUser} from "../../hooks/api/useUser";
import {UserRole} from "../../codegen/generated-types";
import {theme} from "../../theme/theme";

const useStyles = makeStyles(theme => ({
    headerText: {
        borderLeft: "1px solid " + theme.palette.primary.main,
        paddingLeft: theme.spacing(1)
    },
    sectionContainer: {
        paddlingLeft: theme.spacing(2)
    }
}))

export const TournamentAdminPage = (): JSX.Element => {
    const classes = useStyles()
    const {currentUser} = useGetCurrentUser();

    if (currentUser?.role !== UserRole.Admin && currentUser?.role !== UserRole.Organizer) {
        return <>You are not allowed to view this page</>
    }

    return <CenteredPage>
        <Typography variant={"h2"} color={"primary"}>Turneringsredigering (ADMIN)</Typography>
        <CSDivider/>
        <Grid container direction={"row"}>
            <Grid item xs={12} md={8} className={classes.sectionContainer}>
                <Typography variant={"subtitle1"} className={classes.headerText}>Alle turneringer</Typography>
                <Divider/>
            </Grid>
            <Grid item xs={12} md={4} className={classes.sectionContainer}>
                <Typography variant={"subtitle1"} className={classes.headerText}>Seneste turneringer</Typography>
                <Divider/>
            </Grid>
        </Grid>
    </CenteredPage>
}