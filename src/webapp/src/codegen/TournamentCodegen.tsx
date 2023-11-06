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
            picture,
            description,
            format,
            startDateAndTime,
            numberOfTeamsAllowed,
            teamRegistrations {
                id,
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