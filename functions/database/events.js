/***
 *    ######## ##     ## ######## ##    ## ########  ######  
 *    ##       ##     ## ##       ###   ##    ##    ##    ## 
 *    ##       ##     ## ##       ####  ##    ##    ##       
 *    ######   ##     ## ######   ## ## ##    ##     ######  
 *    ##        ##   ##  ##       ##  ####    ##          ## 
 *    ##         ## ##   ##       ##   ###    ##    ##    ## 
 *    ########    ###    ######## ##    ##    ##     ######  
 */

import { db } from "../firebase";
import { parseFirebaseDocs } from "../utils/dataparser";

// ====================================================================
// Récupère tous les events du calendrier
// ====================================================================
/**
 * Permet de récupérer tous les events de la base de donnée
 * @returns "Retourne un objet contenant les events de la BDD"
 */
 export async function getEvents() {

    const query = await db.collection('events').get()
    if(query.empty) return []

    return parseFirebaseDocs(query.docs)

}

// ====================================================================
// Ajoute un évènement dans le calendrier
// ====================================================================
/**
 * Permet d'ajouter un event dans le calendrier
 * @returns "Retourne l'id du nouvel event"
 */
 export async function addEvent(data) {

    const event = {
        created_at: Date.now(),
        title: data.title,
        desc: data.desc,
        date: data.date,
        tag: data.tag
    }

    const query = await db.collection('events').add(event)
    return query.id

}

// ====================================================================
// Modifie un évènement dans le calendrier
// ====================================================================
/**
 * Permet d'edit un event du calendrier
 * @param id "Id de l'event à modifier"
 * @param data "Objet des nouvelles données"
 * @returns "Retourne true"
 */
export async function editEvent(id, data) {

    const query = await db.collection('events').doc(id).update(data)
    return true

}

// ====================================================================
// Supprime un évènement dans le calendrier
// ====================================================================
/**
 * Permet d'edit un event du calendrier
 * @param id "Id de l'event à supprimer"
 * @returns "Retourne true"
 */
 export async function deleteEvent(id) {

    const query = await db.collection('events').doc(id).delete()
    return true

}