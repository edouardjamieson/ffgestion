import moment from "moment";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

export default function Calendar() {

    const [calendar, setCalendar] = useState([])
    const [momentValue, setMomentValue] = useState(moment().locale('fr'))
    const [newEventDay, setNewEventDay] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        const startDay = momentValue.clone().startOf('month').startOf('week')
        const endDay = momentValue.clone().endOf('month').endOf('week')
        const day = startDay.clone().subtract(1, 'day')

        const builder = []
        while(day.isBefore(endDay, 'day')) {
            builder.push(
                Array(7)
                .fill(0)
                .map(() => day.add(1, 'day').clone())
            )
        }

        setCalendar(builder)


    }, [momentValue])

    // ====================================================================
    // FUNCTIONS / ACTIONS
    // ====================================================================
    const handleSwitchMonth = (direction) => {
        
        setMomentValue(
            direction === -1 ?
            momentValue.clone().subtract(1, 'month') :
            momentValue.clone().add(1, 'month')
        )

    }

    // ====================================================================
    // HELPERS
    // ====================================================================

    const isBeforeToday = (day) => {
        return day.isBefore(new Date(), 'day')
    }

    const isToday = (day) => {
        return day.isSame(new Date(), 'day')
    }

    const isWeekend = (day) => {
        //0 = dimanche
        //6 = samedi
        return ["0","6"].includes(day.format('d'))
    }

    const getStyles = (day) => {
        let classname = "calendar-week_day"
        if(isToday(day)) classname += " today"
        if(isBeforeToday(day)) classname += " before-today"
        if(isWeekend(day)) classname += " weekend"
        return classname
    }

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

    // ====================================================================
    // COMPONENTS
    // ====================================================================

    const Calendar = () => {

        return calendar.map(week => 
            <div className="calendar-week" key={week}>
                {
                    week.map(day => 
                        <div
                            className={getStyles(day)}
                            key={day.format('D')}
                            onDoubleClick={() => {
                                if(!isBeforeToday(day)) {
                                    setNewEventDay(day)
                                    setModalVisible(true)
                                }
                            }}
                        >


                            <div className="calendar-week_day-head">{ day.format('D') }</div>
                        </div>
                    )
                }
            </div>
        )
    }

    const CalendarPicker = () => {
        return (
            <div className="calendar-picker">
                <button type="button" className="calendar-picker_button" onClick={() => handleSwitchMonth(-1)}>
                    <i className="fas fa-arrow-left"></i>
                    <span>{ getMonthInFrench(momentValue.clone().subtract(1, 'month').format('MMMM')) }</span>
                </button>

                <span className="calendar-picker_current">{ getMonthInFrench(momentValue.clone().format('MMMM')) } {momentValue.clone().format('YYYY')}</span>
                
                <button type="button" className="calendar-picker_button" onClick={() => handleSwitchMonth(1)}>
                    <span>{ getMonthInFrench(momentValue.clone().add(1, 'month').format('MMMM')) }</span>
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
        )
    }

    const CalendarHead = () => {
        return (
            <div className="calendar-head">
                <div className="calendar-head_day weekend">Dimanche</div>
                <div className="calendar-head_day">Lundi</div>
                <div className="calendar-head_day">Mardi</div>
                <div className="calendar-head_day">Mercredi</div>
                <div className="calendar-head_day">Jeudi</div>
                <div className="calendar-head_day">Vendredi</div>
                <div className="calendar-head_day weekend">Samedi</div>
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
                <CalendarPicker />
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
