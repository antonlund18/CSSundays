import {gql} from "@apollo/client";

gql`
    mutation createTournament($name: String!, $date: LocalDateTime!, $format: TournamentFormat!, $numberOfTeamsAllowed: Int!, $picture: String, $description: String!, $rules: String!) {
        createTournament(name: $name, date: $date, numberOfTeamsAllowed: $numberOfTeamsAllowed, format: $format, picture: $picture, description: $description, rules: $rules) {
            id,
            name,
            picture,
            description,
            format,
            rules,
            bracket {
                id,
                root {
                    id,
                    left {
                        id
                    },
                    right {
                        id
                    }
                }
            }
            startDateAndTime,
            numberOfTeamsAllowed
        }
    }
`

gql`
    query getAllTournaments {
        getAllTournaments {
            id,
            name,
            picture,
            description,
            format,
            rules,
            bracket {
                id,
                root {
                    id,
                    left {
                        id
                    },
                    right {
                        id
                    }
                }
            }
            startDateAndTime,
            numberOfTeamsAllowed,
            tournamentRegistrations {
                team {
                    id
                },
                id
            },
            createdTs,
            status,
            published
        }
    }
`;

gql`
    mutation generateBracket($tournamentId: Int!) {
        generateBracket(tournamentId: $tournamentId) {
            id,
            bracket {
                id,
                root {
                    id,
                    left {
                        id
                    },
                    right {
                        id
                    },
                    parent {
                        id
                    },
                    tournamentRegistration1 {
                        team {
                            id,
                            name
                        }
                    },
                    tournamentRegistration2 {
                        team {
                            id,
                            name
                        }
                    }
                }
            }
        }
    }
`

gql`
    query getTournamentById($id: Int!) {
        getTournamentById(id: $id) {
            id,
            name,
            picture,
            description,
            format,
            rules,
            startDateAndTime,
            numberOfTeamsAllowed,
            tournamentRegistrations {
                id,
                captain {
                    id,
                    playertag,
                    picture
                }
                team {
                    id,
                    name
                    picture
                    deletedTs
                },
                players {
                    id,
                    playertag,
                    picture,
                }
                createdTs
            },
            bracket {
                id,
                root {
                    id,
                    tournamentRegistration1 {
                        team {
                            id,
                            name,
                            picture
                        }
                        players {
                            id,
                            playertag,
                            picture,
                        }
                    },
                    tournamentRegistration2 {
                        team {
                            id,
                            name,
                            picture
                        }
                        players {
                            id,
                            playertag,
                            picture,
                        }
                    }
                    currentPhase {
                        id,
                        phaseType,
                        createdTs,
                        endTs,
                        match {
                            id
                        }
                        state {
                            __typename
                            ... on MatchReadyCheckPhaseState {
                                id
                                teamOneAction {
                                    ready
                                }
                                teamTwoAction {
                                    ready
                                }
                            }
                            ... on MatchPickAndBanPhaseState {
                                id,
                                firstTeamToBan
                                votingTimeInSeconds
                                actions {
                                    id
                                    captain {
                                        id
                                    }
                                    ban
                                }
                            }
                            ... on MatchInProgressPhaseState {
                                id,
                                map
                            }
                            ... on MatchFinishedPhaseState {
                                id,
                                winTeamOne
                            }
                        }
                    }
                }
            }
        }
    }
`

gql`
    mutation publishTournament($tournamentId: Int!) {
        publishTournament(tournamentId: $tournamentId) {
            id,
            published
        }
    }
`

gql`
    mutation removePublicationFromTournament($tournamentId: Int!) {
        removePublicationFromTournament(tournamentId: $tournamentId) {
            id,
            published
        }
    }
`

gql`
    query getTournamentRegistrationByPlayer($tournamentId: Int!, $playerId: Int!) {
        getTournamentRegistrationByPlayer(tournamentId: $tournamentId, playerId: $playerId) {
            id
            team {
                id
                name
                picture
                users {
                    id
                    playertag
                    picture
                }
                deletedTs
            },
            tournament {
                id
            },
            captain {
                id
            }
            players {
                id
                playertag
                picture
                deletedTs
            }
        }
    }
`

gql`
    query getTournamentRegistrationByTeam($tournamentId: Int!, $teamId: Int!) {
        getTournamentRegistrationByTeam(tournamentId: $tournamentId, teamId: $teamId) {
            id
            team {
                id
            },
            captain {
                id
                playertag
                picture
            },
            players {
                id
                deletedTs
            }
        }
    }
`

gql`
    mutation startTournament($tournamentId: Int!) {
        startTournament(tournamentId: $tournamentId) {
            id
        }
    }
`

gql`
    query getTournamentByMatch($matchId: Int!) {
        getTournamentByMatch(matchId: $matchId) {
            id
            name
        }
    }
`