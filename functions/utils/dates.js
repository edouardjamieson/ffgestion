import moment from "moment";

export function isToday(day) {
    return day.isSame(new Date(), 'day')
}

export function isWeekend(day) {
    //0 = dimanche
    //6 = samedi
    return ["0","6"].includes(day.format('d'))
}

export function isBeforeToday(day) {
    return day.isBefore(new Date(), 'day')
}