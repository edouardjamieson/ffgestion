import { parseFirebaseDocs, parseFirebaseDoc } from '../utils/dataparser'
import { db, fields, storage } from './../firebase'
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
        image: image_url,
        created_at: Date.now(),
        tasks: ""
    }

    const query = await db.collection('projects').add(project)
    return query.id
}

