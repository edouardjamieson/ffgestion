import { useRouter } from "next/router"
import { useState } from "react"
import Cta from "../../components/Cta"
import Error from "../../components/Error"
import Layout from "../../components/Layout"
import { addProject } from "../../functions/database/projects"
import { checkIfImage, sanitizeFileName } from "../../functions/utils/string"

export default function NewProject() {

    const router = useRouter()

    // Avec react, pour la gestion des valeurs des inputs, on doit utiliser des states
    // Tous les inputs ont donc un "value" & un "onChange"
    const [projectImageName, setProjectImageName] = useState("")
    const [projectImagePreview, setProjectImagePreview] = useState("")
    const [projectImage, setProjectImage] = useState("")

    const [projectName, setProjectName] = useState("")

    const [error, setError] = useState(null)
    const [validating, setValidating] = useState(false)

    // ====================================================================
    // Fonction appelée lorsqu'on selectionne une image
    // ====================================================================
    const handleSelectImage = (file) => {


        const image = file[0]
        const type = image.type
        const size = image.size
        const name = sanitizeFileName(image.name)

        //Regarde si l'image est une image
        if(!checkIfImage(type, [])) return setError("Ce type de fichier n'est pas autorisé comme image de projet.")
        // Regarde si l'image est trop lourde
        if(size > 100000000) return setError("Cette image est trop lourde!")

        //Tout est good on peut setup le state de preview & le state pour le fichier de l'image
        setProjectImagePreview(URL.createObjectURL(image))
        setProjectImageName(name)
        
        //J'utilise le FileReader pour obtenir l'image en base64
        const reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onload = () => {
            setProjectImage(reader.result)
        }

    }

    // ====================================================================
    // Fonction appelée lorsqu'on envois le formulaire
    // ====================================================================
    const handleFormSubmit = (e) => {

        e.preventDefault()
        setValidating(true)
        
        if(!projectImage) {
            setValidating(false)
            return setError("Aucune image de projet :(")
        }
        if(!projectName.trim()) {
            setValidating(false)
            return setError("Aucun nom de projet :(")
        }

        //Tout est good on appel la fonction pour ajouter le projet
        addProject({
            name: projectName,
            image_name: projectImageName,
            base64: projectImage
        })
        .then(id => router.push('/projects'))
        .catch(err => {
            console.log(err);
            setValidating(false)
            return setError("Une erreur s'est produite. Call 1-800-JOCELYN")
        })

    }


    return (
        <Layout
            title="Nouveau projet"
            isValidating={validating}
        >

            <div className="create-project">

                <form id="create-project" onSubmit={e => handleFormSubmit(e)}>

                    <div className="create-project_image">
                        <input type="file" id="create-project_image-input" onChange={e => handleSelectImage(e.target.files)} />
                        <label htmlFor="create-project_image-input" className={ projectImagePreview ? "create-project_image-label preview" : "create-project_image-label" }>
                            <span>cliquez ici pour définir une image de projet</span>
                            <img src={projectImagePreview} alt="project image" />
                        </label>

                    </div>
                    <div className="create-project_infos">
                        <input type="text" placeholder="Nom du projet" value={projectName} onChange={e => setProjectName(e.target.value)} />
                        <Cta type="submit" text="Terminé" icon="fas fa-check" />
                    </div>


                </form>

            </div>

            {
                error ? <Error text={error} onDismiss={() => setError("")} /> : null
            }

        </Layout>
    )
}
