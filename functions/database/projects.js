import { parseFirebaseDocs } from '../utils/dataparser'
import { db, fields } from './../firebase'
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