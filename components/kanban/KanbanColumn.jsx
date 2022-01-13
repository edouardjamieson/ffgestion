import { useEffect, useState } from "react";
import { getTasksByID } from "../../functions/database/projects";
import KanbanTask from "./KanbanTask";

export default function KanbanColumn({ column, onAddTask }) {

    // console.log(column);

    const [tasks, setTasks] = useState([])

    useEffect(() => {

        if(column.data.tasks.length > 0) {
            getTasksByID(column.data.tasks)
            .then(docs => {
                const ordered = docs.sort((a,b) => b.data.created_at - a.data.created_at)
                setTasks(ordered)
            })
        }else{
            setTasks([])
        }
        
    }, [column])

    return (

        <div className="single-project_kanban-row" data-column-id={column.id}>
            <div className="single-project_kanban-row_head">
                <span>{ column.data.name }</span>
                <button type="button" onClick={() => onAddTask(column.id)}>
                    <i className="fas fa-add"></i>
                </button>
            </div>


            <div className="single-project_kanban-row_tasks">
                {
                    tasks.length > 0 ?
                    tasks.map(task => <KanbanTask task={task} key={task.id} column_id={column.id} />)
                    :
                    <p>Aucune tâche dans cette colonne!</p>
                }
            </div>       
        </div> 
    )
}
