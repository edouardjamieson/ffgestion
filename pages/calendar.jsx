import moment, { updateLocale } from "moment";
import { useEffect, useRef, useState } from "react";
import CalendarBody from "../components/calendar/CalendarBody";
import CalendarHead from "../components/calendar/CalendarHead";
import Cta from "../components/Cta";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { getMonthInFrench, parseFirebaseDocs } from "../functions/utils/dataparser";
import Error from '../components/Error'
import { addEvent, getEvents } from "../functions/database/events";
import { db } from "../functions/firebase";

export default function Calendar() {

    updateLocale('en', { week: { dow: 1 } })

    // STATES POUR LE CALENDRIER
    const [momentValue, setMomentValue] = useState(moment())
    const [calendar, setCalendar] = useState([])
    const [calendarEvents, setCalendarEvents] = useState([])

    const [calendarYear, setCalendarYear] = useState(2022)

    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [validating, setValidating] = useState(false)
    const [error, setError] = useState("")

    const [newEventTitle, setNewEventTitle] = useState("")
    const [newEventDesc, setNewEventDesc] = useState("")
    const [newEventDate, setNewEventDate] = useState("")
    const [newEventTag, setNewEventTag] = useState("default")

    let calendar_height = 0
    let calendar_scroll = 0

    useEffect(() => {

        // ====================================================================
        // Construit le calendrier
        // ====================================================================

        const cal = {}

        // On loop au travers des 12 mois pour ajouter nos objets moments & build le calendrier
        for (let i = 0; i < 12; i++) {

            // On target le mois
            const month = moment().month(i)

            // On target le début & la fin du mois
            const startDate = month.clone().startOf('month')
            const endDate = month.clone().endOf('month')

            // On target les jours du début/fin des mois (ex: lundi/mardi/etc)
            const startDay = startDate.isoWeekday()
            const endDay = endDate.isoWeekday()

            const iterator = startDate.clone().subtract(1, 'day')

            // On fait un array & on ajoute les placeholder
            let days = []
            if(startDay !== 1) {
                days = Array(startDay-1).fill(0).map((n,i) => {
                    // Regarde si on est un weekend ou non
                    if(startDay === 7 && i === 5) { return "placeholder-weekend" }
                    return "placeholder"
                })
            }

            // On remplit le calendrier avec nos jours
            while(iterator.isBefore(endDate, 'day')) {
                days.push(iterator.add(1, 'day').clone())
            }

            // On ajoute les placeholders de fin
            if(endDay < 7) {
                days = days.concat(Array(7 - endDay).fill(0).map((n,i) => {
                    // Regarde si on est un weekend ou non
                    const loop = 7-endDay
                    if(i === loop-1 || i === loop-2) { return "placeholder-weekend" }
                    return "placeholder"
                }))  
            }

            cal[i] = {
                month: getMonthInFrench(month.format('MMMM')),
                days: days
            }
        }

        console.log(cal);
        setCalendar(cal)

        // ====================================================================
        // Va chercher les events
        // ====================================================================
        // getEvents()
        // .then(events => setCalendarEvents(events))
        // .then(() => setLoading(false))
        // .then(() => setCalendarHeight())
        db.collection('events').onSnapshot(snap => {
            const events = parseFirebaseDocs(snap.docs)
            setCalendarEvents(events)
            setLoading(false)
            setCalendarHeight()


        })




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

    const handleAddEvent = (e) => {
        e.preventDefault()
        setValidating(true)

        if(!newEventTitle.trim() || !newEventDate.trim() || !newEventTag.trim()) {
            setValidating(false)
            return setError("Certain champs son manquant.")
        }

        const newEvent = {
            title: newEventTitle,
            desc: newEventDesc ? newEventDesc : "",
            date: moment(newEventDate).format('D/MM/YYYY'),
            tag: newEventTag
        }

        addEvent(newEvent)
        .then(id => {
            const events = [...calendarEvents]
            events.push({ id: id, data:newEvent })
            setCalendarEvents(events)
            setValidating(false)
            setModalVisible(false)

            //Reset le modal
            setNewEventDate("")
            setNewEventDesc("")
            setNewEventTitle("")
            setNewEventTag("")
        })



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
            title={`Calendrier ${calendarYear}`}
            hasButton={true}
            buttonLabel="Ajouter un évènement"
            onButtonClick={() => setModalVisible(true)}
            isValidating={validating}
            isLoading={loading}
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
                    onQuickAdd={date => {
                        setNewEventDate(date)
                        setModalVisible(true)
                    }}
                    onMovedEvent={() => {
                        // setMomentValue(moment())
                    }}
                />
            </div>


            {
                modalVisible ?
                <Modal
                    title="ajouter un évènement"
                    onExit={() => setModalVisible(false)}
                >

                    <form id="calendar-event_new" onSubmit={e => handleAddEvent(e)}>
                        <input type="text" placeholder="Nom de l'évènement" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} required="required" />
                        <input type="text" placeholder="Description de l'évènement" value={newEventDesc} onChange={e => setNewEventDesc(e.target.value)} />
                        <input type="date" placeholder="Date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} required="required"  />
                        <select value={newEventTag} onChange={e => setNewEventTag(e.target.value)} required="required" >
                            <option disabled="disabled">Tag</option>
                            <option value="default">⚪️ Aucun</option>
                            <option value="important">🔴 Important</option>
                            <option value="blue">🔵 Bleu</option>
                            <option value="green">🟢 Vert</option>
                        </select>

                        <Cta type="submit" text="Ajouter" icon="fas fa-check" />
                    </form>

                    {
                        error ?
                        <Error text={error} onDismiss={() => setError("")} /> : null
                    }

                </Modal> : null
            }

        </Layout>
    )
}
