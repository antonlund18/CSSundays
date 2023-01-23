import * as React from "react";
import {HomePage} from "../pages/homepage/HomePage";
import {useRoutes} from "react-router";
import {TournamentPage} from "../pages/tournamentpage/TournamentPage";
import {TeamsPage} from "../pages/teamspage/TeamsPage";
import {TeamPage} from "../pages/teamspage/TeamPage";
import {PlayerPage} from "../pages/players/PlayerPage";
import {AdminTournamentsPage} from "../pages/tournamentpage/AdminTournamentsPage";

export const Router = (): JSX.Element => {
    const mainRoutes = [{
        path: "/",
        element: <HomePage/>,
        children: []
    }, {
        path: "/tournaments",
        element: <TournamentPage/>
    }, {
        path: "/tournaments/admin",
        element: <AdminTournamentsPage/>
    }, {
        path: "/teams",
        children: [{
            index: true,
            element: <TeamsPage/>
        }, {
            path: ":teamId",
            element: <TeamPage/>,
        }]
    }, {
        path: "/players",
        children: [{
            index: true,
            element: <></>
        }, {
            path: ":player",
            element: <PlayerPage/>
        }]
    }]


    const routing = useRoutes(mainRoutes);

    return <React.Fragment>
        {routing}
    </React.Fragment>;
}