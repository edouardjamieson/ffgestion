import KanbanTask from "./KanbanTask";

export default function KanbanColumn({ column }) {

    return (

        <div className="single-project_kanban-row">
            <div className="single-project_kanban-row_head">
                <span>{ column.data.name }</span>
                <button type="button">
                    <i className="fas fa-add"></i>
                </button>
            </div>


            <div className="single-project_kanban-row_tasks">
                {
                    // column.tasks.map(task => <KanbanTask task={task} key={task.id} />)
                }
            </div>       
        </div> 
    )
}
