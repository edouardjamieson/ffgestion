import CalendarEvent from "./CalendarEvent"

export default function CalendarCell({ children, styles, date, events }) {
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
