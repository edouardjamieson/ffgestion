import moment from "moment";

export default function KanbanTask({ task }) {
    return (
        <div className="single-project_kanban-row_task">
            <p>{ task.data.content }</p>
            <div className="single-project_kanban-row_task-footer">
                <span>Ajouté le { moment(task.data.created_at).format('D/MM/YYYY') }</span>
                {
                    task.data.file ?
                    <div className="single-project_kanban-row_task-file">
                        <i className="fas fa-paperclip"></i>
                    </div> : null
                }
            </div>
        </div>
    )
}
