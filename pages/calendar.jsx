import moment, { updateLocale } from "moment";
import { useEffect, useRef, useState } from "react";
import CalendarBody from "../components/calendar/CalendarBody";
import CalendarHead from "../components/calendar/CalendarHead";
import Cta from "../components/Cta";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { getMonthInFrench, parseFirebaseDocs } from "../functions/utils/dataparser";
import Error from '../components/Error'
import { addEvent, deleteEvent, editEvent, getEvents } from "../functions/database/events";
import { db } from "../functions/firebase";

export default function Calendar() {

    updateLocale('en', { week: { dow: 1 } })

    // STATES POUR LE CALENDRIER
    const [momentValue, setMomentValue] = useState(moment())
    const [calendar, setCalendar] = useState([])
    const [calendarEvents, setCalendarEvents] = useState([])

    const [calendarYear, setCalendarYear] = useState(2022)

    const [modalScreen, setModalScreen] = useState("add")
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [validating, setValidating] = useState(false)
    const [error, setError] = useState("")

    const [newEventTitle, setNewEventTitle] = useState("")
    const [newEventDesc, setNewEventDesc] = useState("")
    const [newEventDate, setNewEventDate] = useState("")
    const [newEventTag, setNewEventTag] = useState("default")

    const [deleteEventID, setDeleteEventID] = useState("")
    const [displayEventID, setDisplayEventID] = useState("")

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

        // ====================================================================
        // Permet de déterminer le mois courant
        // ====================================================================

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

        // Si les champs sont vides on cancel
        if(!newEventTitle.trim() || !newEventDate.trim() || !newEventTag.trim()) {
            setValidating(false)
            return setError("Certain champs son manquant.")
        }

        // On créer un objet avec les nouvelles données
        const newEvent = {
            title: newEventTitle,
            desc: newEventDesc ? newEventDesc : "",
            date: moment(newEventDate).format('D/MM/YYYY'),
            tag: newEventTag
        }

        // On appel la fonction pour ajouter l'event
        // On ajoute l'event dans le states des events
        addEvent(newEvent)
        .then(id => {
            const events = [...calendarEvents]
            events.push({ id: id, data:newEvent })
            setCalendarEvents(events)
            setValidating(false)
            setModalVisible(false)
            
        })

        // reset les states
        resetCalendarStates()

    }

    const handleDeleteEvent = () => {

        setValidating(true)

        // On delete l'event & reset le modal
        deleteEvent(deleteEventID)
        .then(() => {
            setValidating(false)
            setModalVisible(false)
        })

    }

    const handleEditEvent = (e) => {
        e.preventDefault()
        setValidating(true)

        // Si les valeurs importantes sont vides on cancel
        if(!newEventTitle.trim() || !newEventDate.trim() || !newEventTag.trim()) {
            setValidating(false)
            return setError("Certain champs son manquant.")
        }

        // On va filter les events pour recup les infos
        const event = calendarEvents.filter(evt => evt.id === displayEventID)[0]
        
        // On va ajouter à un objet ce qu'on a modifier
        // Comme ça si on edit rien, on évite une requête inutile
        const to_edit = {}

        // On compare les nouvelles valeurs aux anciennes & si une est pas pareil on l'ajoute à l'objet
        if(newEventTitle.trim() !== event.data.title) to_edit['title'] = newEventTitle.trim()
        if(newEventDesc.trim() !== event.data.desc) to_edit['desc'] = newEventDesc.trim()
        if(newEventTag !== event.data.tag) to_edit['tag'] = newEventTag
        
        const to_edit_date = moment(newEventDate).format('D/MM/YYYY')
        if(to_edit_date !== event.data.date) to_edit['date'] = to_edit_date

        if(Object.keys(to_edit).length > 0) {
            editEvent(displayEventID, to_edit)
            .then(() => {
                setValidating(false)
                setModalVisible(false)
                resetCalendarStates()
            })
        }else{
            setValidating(false)
            setModalVisible(false)
            resetCalendarStates()
        }

    }

    const resetCalendarStates = () => {

        // Permet de reset les states des inputs d'un nouvel event
        setNewEventDate("")
        setNewEventDesc("")
        setNewEventTitle("")
        setNewEventTag("")
    }

    // ====================================================================
    // HELPERS
    // ====================================================================
    
    // Permet de définir la hauteur du calendrier
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
            onButtonClick={() => {resetCalendarStates(); setModalScreen("add"); setModalVisible(true)}}
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
                        setModalScreen("add")
                        resetCalendarStates()
                        setNewEventDate(date)
                        setModalVisible(true)
                    }}
                    onDeleteEvent={id => {
                        setDeleteEventID(id)
                        setModalScreen("delete")
                        setModalVisible(true)
                    }}
                    onShowEvent={id => {
                        setDisplayEventID(id)

                        // On va filter les events pour recup les infos
                        const event = calendarEvents.filter(evt => evt.id === id)[0]
                        
                        // On set les states des inputs
                        // Je réutilise ceux d'un nouvel events car ils sont identiques 
                        setNewEventDesc(event.data.desc)
                        setNewEventTitle(event.data.title)
                        setNewEventTag(event.data.tag)
                        setNewEventDate(moment(event.data.date, 'D/MM/YYYY').format('YYYY-MM-D'))

                        setModalScreen("edit")
                        setModalVisible(true)
                    }}
                />
            </div>


            {
                modalVisible ?
                <Modal
                    title={
                        modalScreen === "add" ?
                        "ajouter un évènement" :
                        modalScreen === "edit" ?
                        "évènement" :
                        modalScreen === "delete" ?
                        "supprimer cet évènement ?" : null

                    }
                    onExit={() => setModalVisible(false)}
                >
                    {
                        modalScreen === "add" ?
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
                        :
                        modalScreen === "edit" ?
                        <form id="calendar-event_new" onSubmit={e => handleEditEvent(e)}>
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

                            <Cta type="submit" text="Enregistrer" icon="fas fa-save" />
                        </form>
                        :
                        modalScreen === "delete" ?
                        <>
                            <p style={{ marginBottom:"1rem" }}>Supprimer cet évènement entraînera sa perte sur l'entièrté de la planète, souhaitez-vous continuer ?</p>
                            <Cta type="button" text="Supprimer" icon="fas fa-trash-alt" onClick={() => handleDeleteEvent()} />
                        </>
                        :
                        null
                    }

                    {
                        error ?
                        <Error text={error} onDismiss={() => setError("")} /> : null
                    }

                </Modal> : null
            }

        </Layout>
    )
}
