/***
 *    ##     ## ######## #### ##       ####  ######     ###    ######## ######## ##     ## ########   ######  
 *    ##     ##    ##     ##  ##        ##  ##    ##   ## ##      ##    ##       ##     ## ##     ## ##    ## 
 *    ##     ##    ##     ##  ##        ##  ##        ##   ##     ##    ##       ##     ## ##     ## ##       
 *    ##     ##    ##     ##  ##        ##   ######  ##     ##    ##    ######   ##     ## ########   ######  
 *    ##     ##    ##     ##  ##        ##        ## #########    ##    ##       ##     ## ##   ##         ## 
 *    ##     ##    ##     ##  ##        ##  ##    ## ##     ##    ##    ##       ##     ## ##    ##  ##    ## 
 *     #######     ##    #### ######## ####  ######  ##     ##    ##    ########  #######  ##     ##  ######  
 */

import { db } from "../firebase"
import { parseFirebaseDoc } from "../utils/dataparser"

// ====================================================================
// Récupère l'utilisateur courant
// ====================================================================
/**
 * Permet de récupérer l'utilisateur courant
 * @returns "Retourne un objet contenant les infos du user ou null si aucun user"
 */
export async function getAuth() {

    const storage = window.localStorage
    const uid = storage.getItem('ffgestion-userid')

    if(!uid) return null

    const query = await db.collection('users').doc(uid).get()

    if(!query.exists) return null

    return parseFirebaseDoc(query)

}

// ====================================================================
// Récupère l'id de l'utilisateur courant
// ====================================================================
/**
 * Permet de récupérer l'id l'utilisateur courant
 * @returns "Retourne l'id de l'utilisateur courant ou null si non-connecté"
 */
export function getAuthID() {

    const storage = window.localStorage
    const uid = storage.getItem('ffgestion-userid')

    if(!uid) return null
    return uid

}

// ====================================================================
// Définie l'utilisateur courant
// ====================================================================
/**
 * Permet de définir l'utilisateur courant
 * @returns "Retourne true si tout est ok sinon false"
 */
export async function setAuth(username, password) {

    const query = await db.collection('users')
    .where('username', '==', username)
    .where('password', '==', password)
    .get()

    if(query.empty) return false

    const user = query.docs[0]
    const storage = window.localStorage
    storage.setItem('ffgestion-userid', user.id)

    return true

}

// ====================================================================
// Récupère un utilisateur par son ID
// ====================================================================
/**
 * Permet d'avoir les infos d'un utilisateur par son id
 * @param user_id "ID de l'utilisateur"
 * @returns "Un objet contenant les infos de l'utilisateur ou null si inexistant"
 */
export async function getUserByID(user_id) {
    
    const query = await db.collection('users').doc(user_id).get()

    if(!query.exists) return null
    return parseFirebaseDoc(query)

}