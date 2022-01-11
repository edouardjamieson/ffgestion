import CalendarEvent from "./CalendarEvent"

export default function CalendarCell({ children, styles, date, events, placeholder, onAddClick, onMovedEvent }) {

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
                <button onClick={() => onAddClick(date.format('YYYY-MM-D'))}>
                    <i className="fas fa-add"></i>
                </button>
                <span>{ date.format('D') }</span>
            </div>

            {
                events.map(event =>
                    <CalendarEvent 
                        key={event.id}
                        date={event.data.date} 
                        title={event.data.title}
                        desc={event.data.desc}
                        tag={event.data.tag}
                        id={event.id}
                        onMovedEvent={() => onMovedEvent()}
                    />)
            }

        </div>
    )
}
