export const calculateWinrate = (wins: number | undefined, losses: number | undefined): string => {
    if (!wins || !losses) return "0%"
    if (losses === 0) return "0%"
    return (wins / (wins + losses) * 100).toPrecision(2) + "%";
}