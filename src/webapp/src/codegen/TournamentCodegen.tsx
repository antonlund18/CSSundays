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
            teamRegistrations {
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
                    team1 {
                        id,
                        name
                    },
                    team2 {
                        id,
                        name
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
            teamRegistrations {
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
                    users {
                        id,
                        picture,
                        playertag
                    }
                },
                createdTs
            },
            bracket {
                id,
                root {
                    id,
                    team1 {
                        id,
                        name,
                        picture
                        users {
                            id
                            playertag
                            picture
                        }
                    },
                    team2 {
                        id,
                        name,
                        picture
                        users {
                            id
                            playertag
                            picture
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
            }
        }
    }
`

gql`
    mutation deregisterTeamFromTournament($tournamentId: Int!, $teamId: Int!) {
        deregisterTeamFromTournament(tournamentId: $tournamentId, teamId: $teamId) {
            id
            teamRegistrations {
                id
                team {
                    id
                    name
                    picture
                }
                players {
                    id
                    playertag
                    picture
                }
            }
        }
    }
`

gql`
    mutation deregisterPlayerFromTournament($tournamentId: Int!, $playerId: Int!) {
        deregisterPlayerFromTournament(tournamentId: $tournamentId, playerId: $playerId) {
            id
            teamRegistrations {
                id
                team {
                    id
                    name
                    picture
                }
                players {
                    id
                    playertag
                    picture
                }
            }
        }
    }
`