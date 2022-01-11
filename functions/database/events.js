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
    return parseFirebaseDocs(query)

}