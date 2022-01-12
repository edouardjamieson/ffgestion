import moment from "moment";
import { useEffect } from "react";

export default function KanbanTask({ task }) {

    useEffect(() => {
    

        
        return () => {
            
        }
    }, [])

    const handleMovePress = (e) => {
        return

        // Kanban
        const kanban = document.querySelector('.single-project_kanban')
        // Tache phantome
        const ghost = document.querySelector('.ghost')

        // Si on est déjâ en train de bouger on cancel
        if(kanban.classList.contains('moving-task')) return

        // On ajoute la classe & set l'event qu'on bouge
        kanban.classList.add('moving-task')
        kanban.setAttribute('data-moving', task.id)

        // On met le html du ghost comme celui de l'event à bouger & on met le tag
        ghost.innerHTML = document.querySelector(`#kanban-task_${task.id}`).innerHTML

        // On positionne le ghost sur le curseur
        ghost.style.width = document.querySelector(`#kanban-task_${task.id}`).clientWidth + "px"
        ghost.style.top = e.clientY + window.scrollY + "px"
        ghost.style.left = e.clientX + "px"

        // On enlève la classe à la task qui a bougé
        document.querySelector(`#kanban-task_${kanban.getAttribute('data-moving')}`).classList.remove('moving')

    }

    const handleMoveUnpress = (e) => {
        // Kanban
        const kanban = document.querySelector('.single-project_kanban')
        // Tache phantome
        const ghost = document.querySelector('.ghost')

        if(!kanban.classList.contains('moving-task')) return

        // On ajoute la classe à la task à bouger
        document.querySelector(`#kanban-task_${kanban.getAttribute('data-moving')}`).classList.add('moving')

    }

    const handleMoveDrag = (e) => {

    }

    return (
        <div className="single-project_kanban-row_task" id={`kanban-task_${task.id}`}>
            <p>{ task.data.content }</p>
            <div className="single-project_kanban-row_task-footer">
                <span>Ajouté le { moment(task.data.created_at).format('D/MM/YYYY') }</span>
                {
                    task.data.file ?
                    <div className="single-project_kanban-row_task-icon">
                        <i className="fas fa-paperclip"></i>
                    </div> : null
                }
                <div className="single-project_kanban-row_task-icon" onMouseDown={e => handleMovePress(e)}>
                    <i className="fas fa-arrows"></i>
                </div>
            </div>
        </div>
    )
}
