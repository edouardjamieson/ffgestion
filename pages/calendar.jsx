import moment, { updateLocale } from "moment";
import { useEffect, useRef, useState } from "react";
import CalendarBody from "../components/calendar/CalendarBody";
import CalendarHead from "../components/calendar/CalendarHead";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { getMonthInFrench } from "../functions/utils/dataparser";

export default function Calendar() {

    updateLocale('en', { week: { dow: 1 } })

    // STATES POUR LE CALENDRIER
    const [momentValue, setMomentValue] = useState(moment())
    const [calendar, setCalendar] = useState([])
    const [calendarEvents, setCalendarEvents] = useState([
        { date: '27/01/2022', title:'yo', desc:'xd', tag: 'important' },
        { date: '27/01/2022', title:'ne pas oublier daller acheter du lait', desc:'xd', tag: 'blue' },
        { date: '22/01/2022', title:'yeet', desc:'xd', tag: '' },
    ])

    const [calendarYear, setCalendarYear] = useState(2022)

    const [modalVisible, setModalVisible] = useState(false)

    let calendar_height = 0
    let calendar_scroll = 0

    useEffect(() => {

        // Détermine la hauteur du calendrier 
        setCalendarHeight()

        const cal = {}

        // On loop au travers des 12 mois pour ajouter nos objets moments & build le calendrier
        for (let i = 0; i < 12; i++) {

            const month = moment().month(i)
            const startDate = month.clone().startOf('month').startOf('week')
            const endDate = month.clone().endOf('month').endOf('week')
            const iterator = startDate.clone().subtract(1, 'day')
            
            let days = []
            while(iterator.isBefore(endDate, 'day')) {
                days.push(iterator.add(1, 'day').clone())
            }

            cal[i] = {
                month: getMonthInFrench(month.format('MMMM')),
                days: days
            }
        }

        console.log(cal);
        setCalendar(cal)
        // Le useEffect est set sur le momentValue pcq on veut tout recalculer si la valeur
        // de moment() change (ex: changer de mois)
    }, [momentValue])

    // ====================================================================
    // FUNCTIONS / ACTIONS
    // ====================================================================

    const handleCalendarScroll = (e) => {

        const calendarElement = document.querySelector('.calendar-content')
        const calendarMonthElement = document.querySelector('.calendar-picker_current')

        const scroll = calendarElement.scrollTop
        const months = calendarElement.querySelectorAll('.calendar-month')
        
        const points = []
        months.forEach(el => points.push({dist: el.offsetTop, month: el.getAttribute('data-month')}))

        const closest = points.reduce((prev, curr) => {
            return ( Math.abs(curr.dist - scroll) < Math.abs(prev.dist - scroll) ? curr : prev )
        })

        calendar_scroll = scroll

        const month_name = getMonthInFrench(moment().month(closest.month).format('MMMM'))
        if(month_name !== calendarMonthElement.textContent) {
            calendarMonthElement.textContent = month_name
        }
    }

    // ====================================================================
    // HELPERS
    // ====================================================================
    
    const setCalendarHeight = () => {
        calendar_height = window.innerHeight
        - document.querySelector('.main-header').clientHeight
        - document.querySelector('.hero').clientHeight
        - document.querySelector('.calendar-head').clientHeight
        - 64
        document.documentElement.style.setProperty('--calendar-height', calendar_height)
    }

    // Permet de scroller le calendrier jusqu'à aujourd'hui
    const scrollToToday = () => {
        const today = momentValue.clone().format('D/MM/YYYY')
        const element_with_date = document.querySelectorAll(`.calendar-day[data-date="${today}"]`)[0]
        element_with_date.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <Layout
            title="Calendrier"
            hasButton={true}
            buttonLabel="Ajouter un évènement"
        >


            <div className="calendar">
                <CalendarHead
                    onClickToday={() => scrollToToday()}
                />
                <CalendarBody
                    calendar={calendar}
                    onScroll={e => handleCalendarScroll(e)}
                    onBuiltToday={() => scrollToToday()}
                    events={calendarEvents}
                />
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
