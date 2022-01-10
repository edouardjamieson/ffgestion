import moment from "moment"
import { isBeforeToday, isToday, isWeekend } from "../../functions/utils/dates"
import CalendarCell from "./CalendarCell"

export default function CalendarBody({calendar, onScroll, onBuiltToday}) {

    // Permet de donner la bonne classe aux cellules
    const getStyles = (day) => {
        let classname = "calendar-day"
        if(isToday(day)) classname += " today"
        if(isBeforeToday(day)) classname += " before-today"
        if(isWeekend(day)) classname += " weekend"
        return classname
    }

    return (
        <div
            className="calendar-content"
            onScroll={e => onScroll(e)}
        >
            {
                Object.values(calendar).map((month, i) => {
                    const days = calendar[i].days
                    return (
                        <div className="calendar-month" data-month={i} key={i}>
                            {
                                days.map(day => {
                                    if(isToday(day)) {
                                        setTimeout(onBuiltToday, 500)
                                    }
                                    return (
                                        <CalendarCell styles={getStyles(day)} key={`${day.format('D-M')}`} dataDate={day.format('D/MM/YYYY')}>
                                            { day.format('D') }
                                        </CalendarCell>
                                    )
                                }
                                )
                            }
                        </div>
                    )

                    
                })
            }

        </div>
        

    )
}
