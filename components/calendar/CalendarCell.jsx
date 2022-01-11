import CalendarEvent from "./CalendarEvent"

export default function CalendarCell({ children, styles, date, events, placeholder }) {

    // ====================================================================
    // PLACEHOLDER
    // ====================================================================
    if(placeholder === true || placeholder === "weekend") {

        const styles = placeholder === true ? "calendar-day calendar-placeholder" : "calendar-day calendar-placeholder weekend"

        return(
            <div className={styles}></div>
        )
    }

    return (
        <div className={styles} data-date={date.format('D/MM/YYYY')}>

            <div className="calendar-day_head">
                <span>{ date.format('D') }</span>
            </div>

            {
                events.map(event =>
                    <CalendarEvent 
                        date={event.date} 
                        title={event.title}
                        desc={event.desc}
                        tag={event.tag}
                    />)
            }

        </div>
    )
}
