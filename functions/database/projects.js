import { parseFirebaseDocs, parseFirebaseDoc } from '../utils/dataparser'
import { slugify } from '../utils/string'
import { db, fields, storage } from './../firebase'
import { getAuthID } from './users'
/***
 *    ########  ########   #######        ## ########  ######  ########  ######  
 *    ##     ## ##     ## ##     ##       ## ##       ##    ##    ##    ##    ## 
 *    ##     ## ##     ## ##     ##       ## ##       ##          ##    ##       
 *    ########  ########  ##     ##       ## ######   ##          ##     ######  
 *    ##        ##   ##   ##     ## ##    ## ##       ##          ##          ## 
 *    ##        ##    ##  ##     ## ##    ## ##       ##    ##    ##    ##    ## 
 *    ##        ##     ##  #######   ######  ########  ######     ##     ######  
 */

// ====================================================================
// Récupère tous les projets
// ====================================================================
/**
 * Permet de récupérer tous les projets de la base de donnée
 * @returns "Retourne un objet contenant les projets de la BDD"
 */
export async function getProjects() {

    const query = await db.collection('projects').get()
    return parseFirebaseDocs(query.docs)

}

// ====================================================================
// Récupère un projet par son id
// ====================================================================
/**
 * Permet de récupérer un projet dans la base de donnée
 * @param id "id (string) du document"
 * @returns "Retourne un objet contenant un projet ou false si inexistant"
 */
export async function getProject(id) {

    const query = await db.collection('projects').doc(id).get()
    if(!query.exists) return false
    return parseFirebaseDoc(query)

}

// ====================================================================
// Créer un nouveau projet
// ====================================================================
/**
 * Permet de créer et ajouter un projet à la base de donnée
 * @param data "Objet contenant le nom (name) du projet, le base64 de l'image (base64) & le nom de l'image (image_name)"
 * @returns "Retourne l'id de la nouvelle entrée"
 */
 export async function addProject(data) {

    //Upload image
    const upload = await storage
    .ref(`/images/projects/thumbs/${data.image_name}`)
    .putString(data.base64, 'data_url')

    const image_url = await upload.ref.getDownloadURL()

    const project = {
        name: data.name,
        slug: slugify(data.name),
        image: image_url,
        created_at: Date.now(),
        tasks: "",
        occupiedBy: null,
        kanbanLastEditedBy: null
    }

    const query = await db.collection('projects').add(project)
    return query.id
}

// ====================================================================
// Update les infos d'un projet
// ====================================================================
/**
 * Permet de modifier les informations générales d'un projet
 * @param project_id "id du project à modifier"
 * @param data "Objet contenant les informations à modifier"
 * @returns "Retourne true"
 */
export async function editProject(project_id, data) {

    const query = await db.collection('projects').doc(project_id).update(data)

}

// ====================================================================
// Ajoute une colonne dans le kanban d'un projet
// ====================================================================
/**
 * Permet d'ajouter une colonne dans le kanban d'un projet
 * @param project_id "id du projet"
 * @param column_name "Nom de la nouvelle colonne"
 * @returns "Retourne l'id de la nouvelle entrée"
 */
export async function addKanbanColumn(project_id, column_name) {

    const column = {
        name: column_name,
        created_at: Date.now(),
        created_by: getAuthID(),
        tasks: []
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

    const query = await db.collection('kanban').where('__name__', 'in', ids).get()
    return parseFirebaseDocs(query.docs)

}

// ====================================================================
// Bouge une tâche kanban
// ====================================================================
/**
 * Permet de récupèrer des tâches
 * @param project_id "ID du projet contenant la tâche"
 * @param task_id "ID de la tâche à bouger"
 * @param new_column_id "ID de la nouvelle colonne"
 * @returns "Retourne true"
 */
export async function moveKanbanTask(project_id, task_id, old_column_id, new_column_id, position, editedBy) {

    // On dit au projet l'utilisateur qui a fait le changement
    const project_query = await db.collection('projects').doc(project_id).update({
        kanbanLastEditedBy: editedBy
    })
    
    // On enlève la tâche de la colonne courante
    const task_query = await db.collection('projects').doc(project_id).collection('columns').doc(old_column_id).update({
        tasks: fields.arrayRemove(task_id)
    })

    // On récupère les tâches de la nouvelles colonnes
    const new_column_tasks_query = await db.collection('projects').doc(project_id).collection('columns').doc(new_column_id).get()
    const new_column_tasks = parseFirebaseDoc(new_column_tasks_query).data.tasks

    // On insert l'id de la tâche à sa nouvelle position
    new_column_tasks.splice(position, 0, task_id)
    
    // On update les tâches de la colonne
    const update_tasks_query = await db.collection('projects').doc(project_id).collection('columns').doc(new_column_id).update({
        tasks: new_column_tasks
    })

    return true
}