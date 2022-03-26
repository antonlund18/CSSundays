export const calculateWinrate = (wins: number, losses: number): string => {
    if (wins + losses === 0) {
        return "0%";
    }
    return (wins / (wins + losses) * 100).toPrecision(2) + "%";
}