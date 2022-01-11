import { db } from './../firebase'
import { parseFirebaseDocs } from './../utils/dataparser'
/***
 *    ######## ##     ## ######## ##     ## ########  ##       ######## 
 *    ##        ##   ##  ##       ###   ### ##     ## ##       ##       
 *    ##         ## ##   ##       #### #### ##     ## ##       ##       
 *    ######      ###    ######   ## ### ## ########  ##       ######   
 *    ##         ## ##   ##       ##     ## ##        ##       ##       
 *    ##        ##   ##  ##       ##     ## ##        ##       ##       
 *    ######## ##     ## ######## ##     ## ##        ######## ######## 
 */

// ====================================================================
// CE FICHIER N'EXPORTE AUCUNE FUNCTION
// IL PERMET SIMPLEMENT D'OBTENIR UNE LÉGERTE DOCUMENTATION
// ====================================================================

// CHOSES À SAVOIR
// 1. Toutes les fonctions de BDD sont asynchrone
// 2. Une collection est l'équivalent d'une table (ex: Utilisateurs)
// 3. Un document est une donnée dans une table (ex: Utilisateurs > 1)
// 4. Lors d'une requête, firebase nous retourne un objet firebase
//    4.1 objet.id nous donne son id
//    4.2 objet.data() nous donne les données
//    4.3 objet.exists indique si une collection ou un document existe
// 5. Pour qu'elle soit accessible, on doit exporter la function
//    5.1 on peut exporter direct la fonction (export async function test() {} )
//    5.2 on peut exporter toutes les fonctions à la fin du fichier avec -> export { test1, test2 }
// 6. Ne pas oublier d'include la base de donnée ;)

// Comme indiqué ci-haut, aucune fonction de ce document ne sera exportée

// Permet d'obtenir tous les utilisateurs de la BDD
async function getUsersExemple() {

    //await -> puisqu'on est en asynchrone on doit "attendre" les données
    //db -> référence à la bdd
    //.collection('nom de la collection') -> va chercher une collection
    //.get() -> pretty self explanatory (va chercher les données demandées)
    const query = await db.collection('utilisateurs').get()
    
    // Nous avons récupéré les données, nous avons donc un objet firebase
    // Pour accèder aux données, on utilise .docs
    let docs = query.docs
    
    // Pour mieux visualisé et interpreter les données j'ai créé une lil fonction trop clutch permettant
    // de "parse les docs firebase"
    docs = parseFirebaseDocs(docs)

    //parseFirebaseDocs nous retourne un object comme ceci 
    const exemple = [
        { id: "abc123", data: { nom: 'yo' } },
        { id: "abc123", data: { nom: 'yo' } },
        { id: "abc123", data: { nom: 'yo' } },
        { id: "abc123", data: { nom: 'yo' } },
        { id: "abc123", data: { nom: 'yo' } },
    ]


    // On peut ensuite return les données 
    // return docs

}