import moment from "moment";
import { useEffect } from "react";
import { moveKanbanTask } from "../../functions/database/projects";

export default function KanbanTask({ task, i, column_id, onClickTask }) {

    useEffect(() => {
    
        window.addEventListener('mouseup', handleMoveUnpress)
        window.addEventListener('mousemove', handleMoveDrag)
        
        return () => {

            window.removeEventListener('mouseup', handleMoveUnpress)
            window.removeEventListener('mousemove', handleMoveDrag)
            
        }
    }, [])

    const handleMovePress = (e) => {
        // Kanban
        const kanban = document.querySelector('.single-project_kanban')
        // Tache phantome
        const ghost = document.querySelector('.ghost')

        // Si on est déjâ en train de bouger on cancel
        if(kanban.classList.contains('moving-task')) return

        // On ajoute la classe & set l'event qu'on bouge
        kanban.classList.add('moving-task')
        kanban.setAttribute('data-moving', task.id)
        kanban.setAttribute('data-column', column_id)

        // On met le html du ghost comme celui de l'event à bouger & on met le tag
        ghost.innerHTML = document.querySelector(`#kanban-task_${task.id}`).innerHTML

        // On positionne le ghost sur le curseur
        ghost.style.width = document.querySelector(`#kanban-task_${task.id}`).clientWidth + "px"
        ghost.style.top = e.clientY + window.scrollY - ghost.clientHeight + "px"
        ghost.style.left = e.clientX + "px"

        // On ajoute la classe à la task qui bouge
        document.querySelector(`#kanban-task_${kanban.getAttribute('data-moving')}`).classList.add('moving')

    }

    const handleMoveUnpress = (e) => {
        // Kanban
        const kanban = document.querySelector('.single-project_kanban')
        // Tache phantome
        const ghost = document.querySelector('.ghost')

        // Si on est pas en train de bouger on cancel
        if(!kanban.classList.contains('moving-task')) return

        // Si on est sur une dropzone on call la function pour changer la tâche de colonne
        if(e.target.classList.contains('single-project_kanban-dropzone')) {
            moveKanbanTask(
                document.querySelector('.single-project').getAttribute('data-project-id'),
                kanban.getAttribute('data-moving'),
                kanban.getAttribute('data-column'),
                e.target.closest('.single-project_kanban-row').getAttribute('data-column-id'),
                e.target.getAttribute('data-position')
            )
        }

        // On enlève la classe à la task qui a bougé
        document.querySelector(`#kanban-task_${kanban.getAttribute('data-moving')}`).classList.remove('moving')

        // On enlève les infos de mouvement
        kanban.classList.remove('moving-task')
        kanban.removeAttribute('data-moving')
        kanban.removeAttribute('data-column')

        if(document.querySelector('.single-project_kanban-dropzone.active')) {
            document.querySelector('.single-project_kanban-dropzone.active').classList.remove('active')
        }
    }

    const handleMoveDrag = (e) => {
        // Kanban
        const kanban = document.querySelector('.single-project_kanban')
        // Tache phantome
        const ghost = document.querySelector('.ghost')

        if(!kanban || !ghost) return

        if(kanban.classList.contains('moving-task')) {
            ghost.style.top = e.clientY + window.scrollY - ghost.clientHeight + "px"
            ghost.style.left = e.clientX + "px"

            // Permet d'indiquer sur quelle dropzone on va drop
            if(e.target.classList.contains('single-project_kanban-dropzone')) {
                if(document.querySelector('.single-project_kanban-dropzone.active')) {
                    document.querySelector('.single-project_kanban-dropzone.active').classList.remove('active')
                }
                e.target.classList.add('active')
            }else{
                if(document.querySelector('.single-project_kanban-dropzone.active')) {
                    document.querySelector('.single-project_kanban-dropzone.active').classList.remove('active')
                }
            }
        }

    }

    return (
        <>
            <div className="single-project_kanban-dropzone" data-task={task.id} data-position={i}></div>
            <div className="single-project_kanban-row_task" id={`kanban-task_${task.id}`} onClick={() => onClickTask(task)}>
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
        </>
    )
}
