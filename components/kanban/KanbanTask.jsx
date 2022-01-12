export default function KanbanTask({ task }) {
    return (
        <div className="single-project_kanban-row_task">
            <p>{ task.content }</p>
            <span>{ task.created_at }</span>
        </div>
    )
}
