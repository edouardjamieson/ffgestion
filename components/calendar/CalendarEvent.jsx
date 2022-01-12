import { useEffect } from "react";
import { editEvent } from "../../functions/database/events";

export default function CalendarEvent({ date, title, desc, tag, id, onDeleteEvent, onShowEvent }) {

    useEffect(() => {

        window.addEventListener('mousemove', handleMoveDrag)
        window.addEventListener('mouseup', handleMoveUnpress)

        return () => {
            window.removeEventListener('mousemove', handleMoveDrag)
            window.removeEventListener('mouseup', handleMoveUnpress)
        }

    }, [])

    const handleMovePress = (e) => {
        // Calendrier
        const content = document.querySelector('.calendar-content')
        // Event phantome
        const ghost = document.querySelector('.ghost')
        
        // Si on est déjâ en train de bouger on cancel
        if(content.classList.contains('moving-event')) return

        // On ajoute la classe & set l'event qu'on bouge
        content.classList.add('moving-event')
        content.setAttribute('data-moving', id)

        // On met le html du ghost comme celui de l'event à bouger & on met le tag
        ghost.innerHTML = document.querySelector(`#calendar-event_${id}`).innerHTML
        ghost.setAttribute('data-tag', document.querySelector(`#calendar-event_${id}`).getAttribute('data-tag'))

        // On positionne le ghost sur le curseur
        ghost.style.width = document.querySelector(`#calendar-event_${id}`).clientWidth + "px"
        const offset = window.innerHeight - document.documentElement.style.getPropertyValue('--calendar-height')
        ghost.style.top = e.clientY + content.scrollTop - offset + "px"
        ghost.style.left = e.clientX + "px"

        // On ajoute la classe à la note à bouger
        document.querySelector(`#calendar-event_${content.getAttribute('data-moving')}`).classList.add('moving')
    }

    const handleMoveUnpress = (e) => {

        // Calendrier
        const content = document.querySelector('.calendar-content')
        // Event phantome
        const ghost = document.querySelector('.ghost')
        
        // Si on est pas en train de bouger on cancel
        if(!content.classList.contains('moving-event')) return
        // Si le target est un placeholder on cancel
        if(!e.target.classList.contains('calendar-placeholder')) {
            // On appel la fonction pour edit la base de donnée
            editEvent(content.getAttribute('data-moving'), { date: e.target.closest('.calendar-day').getAttribute('data-date') })
        }
        // On enlève la classe à la note qui a bougé
        document.querySelector(`#calendar-event_${content.getAttribute('data-moving')}`).classList.remove('moving')

        // On enlève les infos de mouvement
        content.classList.remove('moving-event')
        content.removeAttribute('data-moving')

    }

    const handleMoveDrag = (e) => {

        const content = document.querySelector('.calendar-content')
        const ghost = document.querySelector('.ghost')

        if(!content || !ghost) return

        if(content.classList.contains('moving-event')) {

            const offset = window.innerHeight - document.documentElement.style.getPropertyValue('--calendar-height')
            ghost.style.top = e.clientY + content.scrollTop - offset + "px"
            ghost.style.left = e.clientX + "px"

        }

    }

    return (
        <div className="calendar-event" id={`calendar-event_${id}`} data-tag={tag}>
            <div className="calendar-event_head">
                <div className="calendar-event_head-tag">{ tag }</div>
                <div className="calendar-event_head-actions">
                    
                    <button type="button" className="calendar-event_head-action"
                        onClick={() => onShowEvent(id)}
                    >
                        <i className="fas fa-pen"></i>
                    </button>
                    <button type="button" className="calendar-event_head-action"
                        onClick={() => onDeleteEvent(id)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    <button type="button" className="calendar-event_head-action"
                        onMouseDown={(e) => handleMovePress(e)}
                    >
                        <i className="fas fa-arrows-alt"></i>
                    </button>
                </div>
            </div>
            <p className="calendar-event_body">{ title }</p>
        </div>
    )
}
