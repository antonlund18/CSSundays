import * as React from "react"
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import {PlayerPicture} from "../../teamspage/team/PlayerPicture";
import {Test} from "../Test";
import {activeDutyMapPool, CS2Map} from "../../../util/MapPool";
import {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import {User} from "../../../codegen/generated-types";

const useStyles = makeStyles(theme => ({
}))

type MatchPageReadyCheckPhaseProps = {
    team1Captain: User | undefined
    team2Captain: User | undefined
}

export const MatchPageReadyCheckPhase = (props: MatchPageReadyCheckPhaseProps) => {
    return <>aber</>
}