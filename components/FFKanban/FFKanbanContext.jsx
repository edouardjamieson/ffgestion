import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { getTasksByID, lockKanbanTask, moveKanbanTask } from "../../functions/database/projects"
import { getAuthID } from "../../functions/database/users"
import Cta from "../Cta"
import Loader from "../Loader"

export default function FFKanbanContext({ columns, project, onAddColumn, onAddTask }) {

    const [loading, setLoading] = useState(true)
    const [kanbanColumns, setKanbanColumns] = useState(columns)
    const [kanbanTasks, setKanbanTasks] = useState([])

    useEffect(() => {
        if(columns.length > 0) {

            // On récupère les ids des tâches dans les colonnes
            let kanban_tasks = columns.map(column => column.data.tasks)
            kanban_tasks = [].concat.apply([], kanban_tasks)

            getTasksByID(kanban_tasks)
            .then(tasks => {
                setKanbanColumns(columns)
                setKanbanTasks(tasks)
                setLoading(false)
            })            
        }
    }, [columns])

    const handleKanbanDragEnd = (result) => {
        const { source, destination, draggableId } = result

        if(!destination) return
        if(destination.droppableId === source.droppableId && destination.index === source.index) return

        const startColumn = [...kanbanColumns].filter(col => col.id === source.droppableId)[0]
        const endColumn = [...kanbanColumns].filter(col => col.id === destination.droppableId)[0]

        const startIndex = kanbanColumns.indexOf(startColumn)
        const endIndex = kanbanColumns.indexOf(endColumn)

        // On enlève la task de la colonne de départ
        startColumn.data.tasks.splice(source.index, 1)

        // On ajoute la task dans la colonne de fin
        endColumn.data.tasks.splice(destination.index, 0, draggableId)

        const cols = [...kanbanColumns]
        // Si on jouait dans la même colonne on ne fait qu'utiliser le endColumn
        if(startIndex === endIndex) {
            cols[endIndex] = endColumn
        }else{
            cols[startIndex] = startColumn
            cols[endIndex] = endColumn
        }

        setKanbanColumns(cols)
        moveKanbanTask(project, draggableId, source.droppableId, destination.droppableId, destination.index, getAuthID())
    }

    const FFKanbanColumn = ({ column }) => {

        return (
            <div className="kanban-column">

                <div className="kanban-column_head">
                    <h4>{ column.data.name }</h4>
                    <button type="button" onClick={() => onAddTask(column.id)}>
                        <i className="fas fa-add"></i>
                    </button>
                </div>

                {/* Droppable indique à DND qu'on veut créer une zone droppable */}
                {/* Il nous retourne une colonne qu'on peut construire */}
                <Droppable droppableId={column.id}>
                    {
                        provided =>
                        <div
                            className="kanban-column_dropzone"
                            ref={provided.innerRef}
                            { ...provided.droppableProps }
                        >

                            {/* On map au travers des tâches */}
                            {
                                column.data.tasks.map((task, index) =>
                                    <FFKanbanCard key={task} task_id={task} index={index} />
                                )
                            }

                            { provided.placeholder }

                        </div>
                    }
                </Droppable>

            </div>
        )

    }

    const FFKanbanCard = ({ task_id, index }) => {

        const task = kanbanTasks.filter(t => t.id === task_id)[0] 
        if(!task) return null

        return (
            <Draggable draggableId={task_id} index={index}>

                {
                    (provided, snapshot) => 
                    <div
                        className={snapshot.isDragging ? "kanban-card is-moving" : "kanban-card" }
                        ref={provided.innerRef}
                        { ...provided.draggableProps }
                        { ...provided.dragHandleProps }
                        onClick={() => console.log("xd")}
                    >
                        { task.data.content }
                    </div>
                }

            </Draggable>
        )

    }


    if(loading) return <Loader />
    return (

        <div className="kanban">

            <div className="kanban-head">
                <h3>Liste des tâches</h3>
                <Cta type="button" text="Ajouter une colonne" onClick={() => onAddColumn()} />
            </div>

            {
                kanbanColumns.length > 0 ?
                // MAIN CONTAINER
                <div className="kanban-container">
                    <DragDropContext onDragEnd={handleKanbanDragEnd}>

                        {/* COLONNES */}
                        {
                            kanbanColumns.map(col => <FFKanbanColumn column={col} key={col.id} />)
                        }



                    </DragDropContext>
                </div>
                :
                <div className="kanban-empty">
                    Vous n'avez pas encore créé de colonne pour ce tableau!
                </div>
            }

        </div>

    )
}
