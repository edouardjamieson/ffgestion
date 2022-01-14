import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { moveKanbanTask } from "../../functions/database/projects"

export default function FFKanbanContext({ columns, tasks, project }) {

    if(columns.length < 1) return null
    if(tasks.length < 1) return null

    const [kanbanColumns, setKanbanColumns] = useState(columns)
    const [kanbanTasks, setKanbanTasks] = useState(tasks)

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
        moveKanbanTask(project, draggableId, source.droppableId, destination.droppableId, destination.index)
    }

    const FFKanbanColumn = ({ column }) => {
        return (
            // Droppable indique à DND qu'on veut créer une zone droppable
            // Il nous retourne une colonne qu'on peut construire
            <Droppable droppableId={column.id}>
                {
                    provided => 
                    <div
                        className="kanban-column"
                        ref={provided.innerRef}
                        { ...provided.droppableProps }
                    >

                        <h4>{ column.data.name }</h4>

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
        )
    }

    const FFKanbanCard = ({ task_id, index }) => {

        const task = kanbanTasks.filter(t => t.id === task_id)[0] 

        return (
            <Draggable draggableId={task_id} index={index}>

                {
                    (provided, snapshot) => 
                    <div
                        className={snapshot.isDragging ? "kanban-card is-moving" : "kanban-card" }
                        ref={provided.innerRef}
                        { ...provided.draggableProps }
                        { ...provided.dragHandleProps }
                    >
                        { task.data.content }
                    </div>
                }

            </Draggable>
        )

    }


    return (

        <div className="kanban">

            {/* MAIN CONTAINER */}
            <DragDropContext onDragEnd={handleKanbanDragEnd}>

                {/* COLONNES */}
                {
                    kanbanColumns.map(col => <FFKanbanColumn column={col} key={col.id} />)
                }



            </DragDropContext>
        </div>

    )
}
