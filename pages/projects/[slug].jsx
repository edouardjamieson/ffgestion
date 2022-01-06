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
    const SyncTimeout = useRef(null)
    const [editorCanEdit, setEditorCanEdit] = useState(true)

    const [error, setError] = useState("")
    const [validating, setValidating] = useState(false)



    useEffect(() => {

        db.collection('projects').doc(project.id).onSnapshot(snap => {
            setEditorContent(snap.data().tasks)
        })
        
    }, [])

    const handleEditorChange = (val) => {


        setEditorContent(val)
        clearTimeout(SyncTimeout.current)
        SyncTimeout.current = setTimeout(() => {
            
            setEditorCanEdit(false)
            console.log("synching...");
            editProject(project.id, { tasks: val })
            .then(() => setEditorCanEdit(true))

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
                        <textarea id="single-project_tasks" value={editorContent} onChange={e => handleEditorChange(e.target.value)} disabled={ editorCanEdit ? "" : "disabled" }></textarea>
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
