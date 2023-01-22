import {useCreateTournamentMutation} from "../../codegen/generated-types";

export const useTournaments = () => {
    const [createTournamentMutation] = useCreateTournamentMutation();

    const createTournament = (name: string, date: string, numberOfTeamsAllowed: number) => createTournamentMutation({
        variables: {
            name,
            date,
            numberOfTeamsAllowed
        },
    })

    return {
        createTournament
    }
}