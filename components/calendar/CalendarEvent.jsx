export default function CalendarEvent({ date, title, desc, tag }) {

    const getStyles = () => {
        let classname = "calendar-event"
        switch (tag) {
            case "important":
                classname += " tag-important"
                break;
            case "blue":
                classname += " tag-blue"
                break;
        }

        return classname
    }

    return (
        <div className={getStyles()}>
            <div className="calendar-event_head">
                <div className="calendar-event_head-tag">{ tag }</div>
                <div className="calendar-event_head-actions">
                    <button type="button" className="calendar-event_head-action">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    <button type="button" className="calendar-event_head-action">
                        <i className="fas fa-arrows-alt"></i>
                    </button>
                </div>
            </div>
            <p className="calendar-event_body">{ title }</p>
        </div>
    )
}
