import { useEffect, useState } from "react";
import { getTasksByID } from "../../functions/database/projects";
import KanbanTask from "./KanbanTask";

export default function KanbanColumn({ column, onAddTask, onClickTask }) {

    // console.log(column);

    const [tasks, setTasks] = useState([])

    useEffect(() => {

        if(column.data.tasks.length > 0) {
            getTasksByID(column.data.tasks)
            .then(docs => {

                const t = []
                column.data.tasks.forEach(val => t.push(docs.filter(doc => doc.id === val)[0]))
                // const ordered = docs.sort((a,b) => b.data.created_at - a.data.created_at)
                setTasks(t)
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
                    tasks.map((task, i) => 
                    <KanbanTask
                        key={task.id}
                        task={task}
                        column_id={column.id}
                        i={i}
                        onClickTask={task => onClickTask(task)}
                    />)
                    :
                    <p>Aucune tâche dans cette colonne!</p>
                }
            </div>       
        </div> 
    )
}
