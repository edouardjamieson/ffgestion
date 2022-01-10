export default function CalendarHead({ onClickToday }) {
    return (
        <div className="calendar-head">
            <div className="calendar-picker">
                <span className="calendar-picker_current">chargement...</span>
                
                <button type="button" className="calendar-picker_button">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <button type="button" className="calendar-picker_button" onClick={() => onClickToday()}>
                    <span>Aujourd'hui</span>
                </button>
                <button type="button" className="calendar-picker_button">
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
            <div className="calendar-head_days">
                <div className="calendar-head_day">Lundi</div>
                <div className="calendar-head_day">Mardi</div>
                <div className="calendar-head_day">Mercredi</div>
                <div className="calendar-head_day">Jeudi</div>
                <div className="calendar-head_day">Vendredi</div>
                <div className="calendar-head_day weekend">Samedi</div>
                <div className="calendar-head_day weekend">Dimanche</div>
            </div>
        </div>
    )
}
