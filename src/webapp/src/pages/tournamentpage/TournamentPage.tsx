import {useGetTournamentById} from "../../hooks/api/useTournament";
import {useParams} from "react-router-dom";
import {CenteredPage} from "../../components/CenteredPage";
import {TournamentBracket} from "./TournamentBracket";

export const TournamentPage = () => {
    const urlParams = useParams();
    const {tournament} = useGetTournamentById(parseInt(urlParams.tournamentId ?? "-1"))

    if (!tournament) {
        return <CenteredPage/>
    }

    return <CenteredPage>
        <TournamentBracket bracket={tournament.bracket}/>
    </CenteredPage>
}