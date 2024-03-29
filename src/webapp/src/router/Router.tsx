import * as React from "react";
import {HomePage} from "../pages/homepage/HomePage";
import {useRoutes} from "react-router";
import {TournamentsPage} from "../pages/tournamentpage/TournamentsPage";
import {TeamsPage} from "../pages/teamspage/TeamsPage";
import {TeamPage} from "../pages/teamspage/team/TeamPage";
import {PlayerPage} from "../pages/players/PlayerPage";
import {AdminTournamentsPage} from "../pages/admin/tournaments/AdminTournamentsPage";
import {TournamentPage} from "../pages/tournamentpage/TournamentPage";
import {AdminCreateTournamentPage} from "../pages/admin/tournaments/AdminCreateTournamentPage";
import {PlayersPage} from "../pages/teamspage/team/PlayersPage";
import {AdminPage} from "../pages/admin/AdminPage";
import {Error404} from "../pages/Error404";
import {MatchPage} from "../pages/matchpage/MatchPage";
import {SearchPage} from "../pages/search/SearchPage";

export const Router = (): JSX.Element => {
    const mainRoutes = [{
        path: "/",
        element: <HomePage/>,
        children: []
    }, {
        path: "/tournaments",
        children: [{
            index: true,
            element: <TournamentsPage/>
        }, {
            path: ":tournamentId",
            element: <TournamentPage/>
        }],
    }, {
        path: "/matches/:matchId",
        element: <MatchPage/>
    }, {
        path: "/teams",
        children: [{
            index: true,
            element: <TeamsPage/>
        }, {
            path: ":teamId",
            element: <TeamPage/>,
        }, {
            path: ":teamId/players",
            element: <PlayersPage/>,
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
    }, {
        path: "/search",
        children: [{
            index: true,
            element: <SearchPage/>
        }, {
            path: ":searchType",
            children: [{
                index: true,
                element: <SearchPage/>
            }, {
                path: ":searchQuery",
                element: <SearchPage/>
            }]
        }],

    }, {
        path: "/admin",
        children: [{
            index: true,
            element: <AdminPage/>
        }, {
            path: "/admin/tournaments",
            children: [{
                index: true,
                element: <AdminTournamentsPage/>
            }, {
                path: "/admin/tournaments/create",
                element: <AdminCreateTournamentPage/>
            }]
        }]
    }, {
        path: "/*",
        element: <Error404/>
    }]


    const routing = useRoutes(mainRoutes);

    return <React.Fragment>
        {routing}
    </React.Fragment>;
}