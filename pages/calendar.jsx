import moment, { updateLocale } from "moment";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

export default function Calendar() {

    updateLocale('en', { week: { dow: 1 } })

    // STATES POUR LE CALENDRIER
    const [calendar, setCalendar] = useState([])
    const [calendarMonthsTrigger, setCalendarMonthsTrigger] = useState({})
    const [momentValue, setMomentValue] = useState(moment())
    const [newEventDay, setNewEventDay] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)

    let calendar_height = 0

    useEffect(() => {

        // Détermine la hauteur du calendrier 
        setCalendarHeight()

        // Récupère le début & la fin de l'année
        const yearStart = momentValue.clone().startOf('year').startOf('week')
        const yearEnd = momentValue.clone().endOf('year').endOf('week')
        const day = yearStart.clone().subtract(1, 'day')

        const cal = []
        while(day.isBefore(yearEnd, 'day')) {
            cal.push(
                Array(7)
                .fill(0)
                .map(() => day.add(1, 'day').clone())
            )
        }

        const triggers = {...calendarMonthsTrigger}
        triggers[momentValue.clone().format('YYYY')] = Array(12).fill(0).map((n,i) => momentValue.clone().month(i).startOf('week').format('w'))
        setCalendarMonthsTrigger(triggers)

        setCalendar(cal)
        // Le useEffect est set sur le momentValue pcq on veut tout recalculer si la valeur
        // de moment() change (ex: changer de mois)
    }, [momentValue])

    // ====================================================================
    // FUNCTIONS / ACTIONS
    // ====================================================================
    
    //Permet de changer de mois
    const handleSwitchMonth = (direction) => {
        
        // On set le state à la nouvelle valeur dépendant de la direction
        setMomentValue(
            direction === -1 ?
            momentValue.clone().subtract(1, 'month') :
            momentValue.clone().add(1, 'month')
        )

    }

    // ====================================================================
    // HELPERS
    // ====================================================================

    // Regarde si une journée est avant la journée d'aujourd'hui
    const isBeforeToday = (day) => {
        return day.isBefore(new Date(), 'day')
    }
    // Regarde si la journée est la journée d'aujourd'hui
    const isToday = (day) => {
        return day.isSame(new Date(), 'day')
    }
    // Regarde si la journée tombe une fin de semaine
    const isWeekend = (day) => {
        //0 = dimanche
        //6 = samedi
        return ["0","6"].includes(day.format('d'))
    }

    // Permet de donner la bonne classe aux cellules
    const getStyles = (day) => {
        let classname = "calendar-week_day"
        if(isToday(day)) classname += " today"
        if(isBeforeToday(day)) classname += " before-today"
        if(isWeekend(day)) classname += " weekend"
        return classname
    }
    // Permet de convertir les mois en français
    const getMonthInFrench = (month) => {
        switch (month) {
            case "January":
                return "Janvier"
            case "February":
                return "Février"
            case "March":
                return "Mars"
            case "April":
                return "Avril"
            case "May":
                return "Mai"
            case "June":
                return "Juin"
            case "July":
                return "Juillet"
            case "August":
                return "Août"
            case "September":
                return "Septembre"
            case "October":
                return "Octobre"
            case "November":
                return "Novembre"
            case "December":
                return "Décembre"
        }
    }

    const setCalendarHeight = () => {
        calendar_height = window.innerHeight
        - document.querySelector('.main-header').clientHeight
        - document.querySelector('.hero').clientHeight
        - document.querySelector('.calendar-head').clientHeight
        - 64
        document.documentElement.style.setProperty('--calendar-height', calendar_height)
    }

    const scrollToToday = () => {
        const today = momentValue.clone().format('MM/DD/YYYY')
        const element_with_date = document.querySelectorAll(`.calendar-week_day[data-date="${today}"]`)[0]
        element_with_date.scrollIntoView({ behavior: 'smooth' })
    }

    // ====================================================================
    // COMPONENTS
    // ====================================================================

    const Calendar = () => {

        return (
            <div className="calendar-content">
                {
                    calendar.map((week, i) => 
                        <div className="calendar-week" key={`trigger-${week[0].format('w')}`}>
                            {
                                calendarMonthsTrigger[momentValue.clone().format('YYYY')].includes(week[0].format('w')) ?
                                <div className="calendar-week_trigger" key={`trigger-${week[0].format('w')}`}></div> : null
                            }
                            {
                                week.map(day => 
                                    <div
                                        className={getStyles(day)}
                                        key={day.format('MM/DD')}
                                        data-date={day.format('MM/DD/YYYY')}
                                        // onDoubleClick={() => {
                                        //     if(!isBeforeToday(day)) {
                                        //         setNewEventDay(day)
                                        //         setModalVisible(true)
                                        //     }
                                        // }}
                                    >


                                        <div className="calendar-week_day-head">{ day.format('D') }</div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }

    const CalendarPicker = () => {
        return (
            <div className="calendar-picker">
                <span className="calendar-picker_current">{ getMonthInFrench(momentValue.clone().format('MMMM')) } {momentValue.clone().format('YYYY')}</span>
                
                <button type="button" className="calendar-picker_button" onClick={() => handleSwitchMonth(-1)}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <button type="button" className="calendar-picker_button" onClick={() => scrollToToday()}>
                    <span>Aujourd'hui</span>
                </button>
                <button type="button" className="calendar-picker_button" onClick={() => handleSwitchMonth(1)}>
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
        )
    }

    const CalendarHead = () => {
        return (
            <div className="calendar-head">
                <CalendarPicker />
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

    return (
        <Layout
            title="Calendrier"
            hasButton={true}
            buttonLabel="Ajouter un évènement"
        >


            <div className="calendar">
                <CalendarHead />
                <Calendar />
            </div>


            {
                modalVisible ?
                <Modal
                    title="ajouter un évènement"
                    onExit={() => setModalVisible(false)}
                >
                    yo
                </Modal> : null
            }

        </Layout>
    )
}
