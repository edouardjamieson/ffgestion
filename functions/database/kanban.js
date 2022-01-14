import { db, fields, storage } from '../firebase'
import { parseFirebaseDoc, parseFirebaseDocs } from '../utils/dataparser'
import { getAuthID } from './users'

/***
 *    ##    ##    ###    ##    ## ########     ###    ##    ## 
 *    ##   ##    ## ##   ###   ## ##     ##   ## ##   ###   ## 
 *    ##  ##    ##   ##  ####  ## ##     ##  ##   ##  ####  ## 
 *    #####    ##     ## ## ## ## ########  ##     ## ## ## ## 
 *    ##  ##   ######### ##  #### ##     ## ######### ##  #### 
 *    ##   ##  ##     ## ##   ### ##     ## ##     ## ##   ### 
 *    ##    ## ##     ## ##    ## ########  ##     ## ##    ## 
 */

// ====================================================================
// Ajoute une colonne dans le kanban d'un projet
// ====================================================================
/**
 * Permet d'ajouter une colonne dans le kanban d'un projet
 * @param project_id "id du projet"
 * @param column_name "Nom de la nouvelle colonne"
 * @param position "position de la nouvelle colonne"
 * @returns "Retourne l'id de la nouvelle entrée"
 */
 export async function addKanbanColumn(project_id, column_name, position) {

    const column = {
        name: column_name,
        created_at: Date.now(),
        created_by: getAuthID(),
        tasks: [],
        order: position
    }

    const query = await db.collection('projects').doc(project_id).collection('columns').add(column)
    return query.id

}

// ====================================================================
// Ajoute une tâche dans le kanban d'un projet
// ====================================================================
/**
 * Permet d'ajouter une tâche dans le kanban d'un projet
 * @param project_id "id du projet"
 * @param column_id "id de la colonne"
 * @param data "Objet contenant les infos de la tâche"
 * @returns "Retourne l'id de la nouvelle entrée"
 */
export async function addKanbanTask(project_id, column_id, data) {

    // Si on a un fichier on l'upload
    let task_file = null
    if(data.base64) {
        const upload = await storage
        .ref(`/images/projects/kanban/${data.file_name}`)
        .putString(data.base64, 'data_url')

        task_file = await upload.ref.getDownloadURL()
    }

    // Ajoute la tâche dans la table des tâches kanban
    const task = {
        content: data.content,
        file: task_file,
        created_at: Date.now(),
        created_by: getAuthID()
    }
    const kanban_query = await db.collection('kanban').add(task)

    // Ajoute l'id de la tâche dans notre colonne
    const project_query = await db.collection('projects').doc(project_id)
        .collection('columns').doc(column_id).update({
            tasks: fields.arrayUnion(kanban_query.id)
        })

}

// ====================================================================
// Récupère les tâches par leur id
// ====================================================================
/**
 * Permet de récupèrer des tâches
 * @param ids "Array contenant les IDs des tâches à aller chercher"
 * @returns "Retourne un objet contenant les contenus des tâches"
 */
export async function getTasksByID(ids) {

    if(ids.length < 1) return []

    const query = await db.collection('kanban').where('__name__', 'in', ids).get()
    return parseFirebaseDocs(query.docs)

}

// ====================================================================
// Lock un tâche kanban
// ====================================================================
/**
 * Permet de lock une tâche
 * @param project_id "ID du projet contenant la tâche"
 * @param task_id "ID de la tâche à lock"
 * @returns "Retourne true"
 */
export async function lockKanbanTask(project_id, task_id) {

    const query = await db.collection('projects').doc(project_id).update({
        lockedTasks: fields.arrayUnion(`${task_id}|${getAuthID()}`)
    })

}

// ====================================================================
// Bouge une tâche kanban
// ====================================================================
/**
 * Permet de récupèrer des tâches
 * @param project_id "ID du projet contenant la tâche"
 * @param task_id "ID de la tâche à bouger"
 * @param old_column_id "ID de l'ancienne colonne"
 * @param new_column_id "ID de la nouvelle colonne"
 * @param position "position de la tâche dans sa"
 * @returns "Retourne true"
 */
export async function moveKanbanTask(project_id, task_id, old_column_id, new_column_id, position) {

    // On récupère les tâches de la nouvelles colonnes
    const new_column_tasks_query = await db.collection('projects').doc(project_id).collection('columns').doc(new_column_id).get()
    const new_column_tasks = parseFirebaseDoc(new_column_tasks_query).data.tasks

    // On insert l'id de la tâche à sa nouvelle position
    new_column_tasks.splice(position, 0, task_id)
    
    // Une batch est une série d'action (sauf read) que l'on veut faire en même temps
    const batch = db.batch()

    // On ajoute l'update pour ajouter la tâche
    batch.update(db.collection('projects').doc(project_id).collection('columns').doc(new_column_id), {
        tasks: new_column_tasks
    })
    // On ajoute l'update pour supprimer la tâche de l'ancienne colonne
    batch.update(db.collection('projects').doc(project_id).collection('columns').doc(old_column_id), {
        tasks: fields.arrayRemove(task_id)
    })

    // On envoit la batch
    await batch.commit()

    return true
}

// ====================================================================
// Bouge une colonne kanban
// ====================================================================
/**
 * Permet de récupèrer des tâches
 * @param project_id "ID du projet contenant la tâche"
 * @param column_id "ID de la tâche à bouger"
 * @param position "ID de l'ancienne colonne"
 * @returns "Retourne true"
 */
export async function moveKanbanColumn(project_id, column_id, position, direction) {

    // On récupère les colonnes
    const columns_query = await db.collection('projects').doc(project_id).collection('columns').get()
    const columns = parseFirebaseDocs(columns_query.docs)

    const newIndex = position + direction

    // On va chercher le colonne qui est à la position désiré
    const column_at_index_query = await db.collection('projects').doc(project_id).collection('columns').where('order', '==', newIndex).get()
    const column_at_index = column_at_index_query.docs[0].id

    const batch = db.batch()

    // On change la position de la colonne voulue
    batch.update(db.collection('projects').doc(project_id).collection('columns').doc(column_id), {
        order: newIndex
    })
    // On change la position de la colonne change avec
    batch.update(db.collection('projects').doc(project_id).collection('columns').doc(column_at_index), {
        order: position
    })

    await batch.commit()
    return true

}
