import Cta from "../Cta";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBody({ kanban, onNewColumn, onAddTask }) {

    return (
        <div className="single-project_kanban">

            <div className="single-project_kanban-head">
                <h4>Liste des tâches</h4>
                <Cta type="button" text="Ajouter une colonne" onClick={() => onNewColumn()} />
            </div>

            <div className="single-project_kanban-rows">

                { 
                    kanban.length > 0 ?
                    kanban.map(column => <KanbanColumn column={column} key={column.id} onAddTask={id => onAddTask(id)} />)
                    :
                    <div className="single-project_kanban-empty">
                        <p>Aucune colonne trouvée! Cliquez sur  "Ajouter une colonne" pour en créer une.</p>
                    </div>
                }
            
            </div>         
            <div className="single-project_kanban-row_task ghost">yo</div>

        </div>
    )
}
