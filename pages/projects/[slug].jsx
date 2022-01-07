// ====================================================================
// CE DOCUMENT VA GÉNÉRER TOUS LES PROJETS (SINGLE)
// ====================================================================

import { useEffect, useRef, useState } from "react"
import Cta from "../../components/Cta"
import Layout from "../../components/Layout"
import { db } from "../../functions/firebase"
import { parseFirebaseDocs } from "../../functions/utils/dataparser"
import Error from "../../components/Error"
import { slugify } from "../../functions/utils/string"
import { editProject } from "../../functions/database/projects"
import { useRouter } from "next/router"
import { getAuthID, getUserByID } from "../../functions/database/users"

// Permet d'aller pre-fetch les informations d'un projet avant de construire la page
export async function getServerSideProps(context) {

    // Le context est un objet de paramètres de requetes reçu
    // params.slug est le paramètre du nom de ce fichier ([slug].jsx), si le fichier s'était nommé
    // [id].jsx, la syntaxe aurait été : params.id
    const slug = context.params.slug

    // On fait une requête à la bdd pour aller chercher le projet ou le slug est = au slug demandé
    let project = await db.collection('projects').where('slug', '==', slug).get()

    // Si rien est retourné, on retourne une indication que rien a été trouvé
    if(project.empty) {
        return { notFound: true }
    }

    // Sinon on parse les données avec notre handy dandy function et on retourne un prop contenant
    // les données de notre projet
    project = parseFirebaseDocs(project.docs)[0]
    return {
        props: project
    }

}

export default function SingleProject(project) {
    //projet est les données reçus par la fonction au dessus

    const router = useRouter()

    // STATES POUR LA CONFIGURATION
    const [configName, setConfigName] = useState(project.data.name)

    // STATES POUR LE LIVE EDITING
    const [editorContent, setEditorContent] = useState("")
    const [editorEditingUser, setEditorEditingUser] = useState(null)
    const [editorEditingUserName, setEditorEditingUserName] = useState("")
    const SyncTimeout = useRef(null)
    const FocusTimeout = useRef(null)
    const TextArea = useRef(null)

    const [error, setError] = useState("")
    const [validating, setValidating] = useState(false)



    useEffect(() => {

        // On démarre un live session avec nos données du projet
        db.collection('projects').doc(project.id).onSnapshot(snap => {

            // ====================================================================
            // Ce code est appelé chaque fois qu'il y a un changement dans le projet
            // ====================================================================

            // Update le contenu de l'éditeur
            setEditorContent(snap.data().tasks)

            // Si plus personne edit, on set les states en conséquences
            if(snap.data().occupiedBy === null) { setEditorEditingUser(null); setEditorEditingUserName("") }
            
            // Sinon on set les states & on va chercher les infos de la personne qui edit
            else {
                setEditorEditingUser(snap.data().occupiedBy)
                getUserByID(snap.data().occupiedBy)
                .then(user => setEditorEditingUserName(user.data.username))
            }

            // Si on est la personne qui edit, on force un focus
            // Ceci est utile si on refresh la page pendant qu'on edit
            if(snap.data().occupiedBy === getAuthID()) {
                TextArea.current.focus()
            }
        })

        window.onbeforeunload = () => {
            handleFocusOut()
        }
        
    }, [])

    const handleFocusIn = (e) => {

        // Si quelqu'un est déjà en train d'étider on bail
        if(editorEditingUser !== null) return

        // Quand on focus le textarea on indique à la bdd qu'on veut éditer
        editProject(project.id, { occupiedBy: getAuthID() })

        // On set un timer de 10 secondes pour cancel le focus
        FocusTimeout.current = setTimeout(handleFocusOut, 10000)


    }

    const handleFocusOut = (e) => {

        // Si personne est en train d'éditer on bail
        if(editorEditingUser === null) return

        // Si on est pas la personne qui éditait on bail
        if(editorEditingUser !== getAuthID()) return

        // Si on est en focus sur le textarea on focus out
        if(document.activeElement.id === "single-project_tasks") TextArea.current.blur()

        // Si on focus out on cancel le timeout
        clearTimeout(FocusTimeout.current)

        // On indique à la bdd qu'on a arrêté d'éditer & on sync les changement
        editProject(project.id, { occupiedBy: null, tasks: editorContent })
    }

    const handleEditorChange = (val) => {

        // On cancel & reset le timeout de focus
        clearTimeout(FocusTimeout.current)
        FocusTimeout.current = setTimeout(handleFocusOut, 10000)

        // On set la nouvelle valeur en local
        setEditorContent(val)

        // On clear le timeout de synchronisation
        clearTimeout(SyncTimeout.current)

        // On set on timeout pour synchroniser
        SyncTimeout.current = setTimeout(() => {
            
            console.log("synching...");
            editProject(project.id, {
                tasks: val,
            })

        }, 1000);
        

    }


    // ====================================================================
    // Fonction pour update la configuration du projet
    // ====================================================================
    const handleUpdateConfig = () => {

        setValidating(true)

        if(!configName.trim()) {
            setValidating(false)
            return setError("Vous devez entrer un nom de projet valide.")
        }

        if(configName === project.data.name) return setValidating(false)

        const new_config = {}
        let should_redirect = false

        //Regarde si on doit modifier le nom
        if(configName !== project.data.name) {
            new_config['name'] = configName
            new_config['slug'] = slugify(configName)
            //indique qu'on va devoir rediriger pcq le slug ne sera plus le même
            should_redirect = true
        }

        //Si on a rien changé on bail
        if(Object.keys(new_config).length === 0) return setValidating(false)

        editProject(project.id, new_config)
        .then(result => {
            if(should_redirect === true) router.push(`/projects/${new_config.slug}`)

            setValidating(false)
        })

    }

    return (
        <Layout
            title={configName ? configName : "mon projet"}
            hasButton={true}
            buttonLabel="Ajouter une tâche"
            isValidating={validating}
        >

            <div className="single-project">

                <div className="single-project_tasks">

                    <div className="single-project_tasks-container">
                        <textarea id="single-project_tasks"
                            value={editorContent}
                            onChange={e => handleEditorChange(e.target.value)}
                            onFocus={e => handleFocusIn(e)}
                            onBlur={e => handleFocusOut(e)}
                            ref={TextArea}
                            disabled={ editorEditingUser === null || editorEditingUser === getAuthID() ? "" : "disabled" }>
                        </textarea>
                        {
                            editorEditingUserName ? 
                            <div className="single-project_tasks-editor">
                                { editorEditingUserName }
                            </div> : null
                        }
                    </div>                

                </div>

                <div className="single-project_infos">

                    <div className="single-project_infos-banner" style={{ backgroundImage: `url(${project.data.image})` }}></div>
                    <div className="single-project_infos-container">
                        <h4>Configuration</h4>
                        <div className="input-container">
                            <span>Nom du projet</span>
                            <input type="text" value={configName} onChange={e => setConfigName(e.target.value)} placeholder="Nom du projet" />
                        </div>

                        {
                            configName !== project.data.name ?
                            <Cta type="button" icon="fas fa-save" text="Sauvegarder" onClick={() => handleUpdateConfig()} /> : null
                        }

                    </div>

                    <div className="single-project_infos-container">
                        <h4>Informations</h4>
                        {/* <p>Le projet <b>{ configName }</b> a été créé le { new Date(project.data.created_at).toLocaleDateString() } par <b>admin</b></p> */}
                    </div>

                </div>

            </div>

            {
                error ? <Error text={error} onDismiss={() => setError("")} /> : null
            }

        </Layout>
    )
}
