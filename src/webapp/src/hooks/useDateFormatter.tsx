export const useDateFormatter = () => {
    const formatDate = (date: string | number | Date): string => {
        const formattedDate = new Date(date)
        return formattedDate.getFullYear()
        + "-" + addZero(formattedDate.getMonth() + 1)
        + "-" + addZero(formattedDate.getDate())
    }

    const formatDateTime = (date: string | number | Date): string => {
        const formattedDate = new Date(date)
        return formattedDate.getFullYear()
        + "-" + addZero(formattedDate.getMonth() + 1)
        + "-" + addZero(formattedDate.getDate())
        + " " + addZero(formattedDate.getHours())
        + ":" + addZero(formattedDate.getMinutes())
    }

    const addZero = (number: number): string => {
        return number.toString().length === 1 ? "0" + number : "" + number
    }
    
    const formatDateRelatively = (date: string | number | Date): string => {
        const time = Math.floor((new Date().valueOf() - new Date(date).valueOf()) / 1000);
        const { interval, unit, pluralSuffix } = calculateTimeDifference(time);
        const suffix = interval === 1 ? '' : pluralSuffix;
        return `${interval} ${unit}${suffix} siden`;
    }

    const calculateTimeDifference = (time: number) => {
        for (let { label, seconds, pluralSuffix } of units) {
            const interval = Math.floor(time / seconds);
            if (interval >= 1) {
                return {
                    interval: interval,
                    unit: label,
                    pluralSuffix: pluralSuffix
                };
            }
        }
        return {
            interval: 0,
            unit: '',
            pluralSuffix: '',
        };
    };

    const units = [
        { label: 'år', seconds: 31536000, pluralSuffix: "" },
        { label: 'måned', seconds: 2592000, pluralSuffix: "er" },
        { label: 'uge', seconds: 604800, pluralSuffix: "r" },
        { label: 'dag', seconds: 86400, pluralSuffix: "e" },
        { label: 'time', seconds: 3600, pluralSuffix: "r" },
        { label: 'minut', seconds: 60, pluralSuffix: "ter" },
        { label: 'sekund', seconds: 1, pluralSuffix: "er" }
    ];

    return {
        formatDateRelatively,
        formatDate,
        formatDateTime
    }
}