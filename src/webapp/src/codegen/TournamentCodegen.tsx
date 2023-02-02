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
    mutation registerTeam($tournamentId: Int!, $teamId: Int!) {
        registerTeam(teamId: $teamId, tournamentId: $tournamentId) {
            id,
            teamRegistrations {
                id,
                team {
                    id,
                    name
                }
            }
        }
    }
`