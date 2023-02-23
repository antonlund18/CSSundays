import {gql} from "@apollo/client";

gql`
    mutation createTournament($name: String!, $date: String!, $numberOfTeamsAllowed: Int!) {
        createTournament(name: $name, date: $date, numberOfTeamsAllowed: $numberOfTeamsAllowed) {
            id,
            name,
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
            date,
            numberOfTeamsAllowed
        }
    }
`

gql`
    query getAllTournaments {
        getAllTournaments {
            id,
            name,
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
            date,
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
                    result,                    
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
            numberOfTeamsAllowed,
            teamRegistrations {
                id
            },
            bracket {
                id,
                root {
                    id,
                    team1 {
                        id,
                        name,
                        picture
                    },
                    team2 {
                        id,
                        name,
                        picture
                    }
                }
            }
        }
    }
`