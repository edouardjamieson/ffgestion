import { useState } from "react"
import Cta from "../../components/Cta"
import Layout from "../../components/Layout"

export default function NewProject() {

    // Avec react, pour la gestion des valeurs des inputs, on doit utiliser des states
    // Tous les inputs ont donc un "value" & un "onChange"
    const [projectImage, setProjectImage] = useState([])
    const [projectName, setProjectName] = useState("")

    const handleFormSubmit = (e) => {

        e.preventDefault()
        console.log(projectName);

    }


    return (
        <Layout
            title="Nouveau projet"
        >

            <div className="create-project">

                <form id="create-project" onSubmit={e => handleFormSubmit(e)}>

                    <div className="create-project_image">
                        <input type="file" id="create-project_image-input" value={projectImage} onChange={e => setProjectImage(e.target.files)} />
                        <label htmlFor="create-project_image-input" className="create-project_image-label">
                            choisir une image
                        </label>

                    </div>
                    <div className="create-project_infos">
                        <input type="text" placeholder="Nom du projet" value={projectName} onChange={e => setProjectName(e.target.value)} />
                    </div>

                    <Cta type="submit" text="Terminé" icon="fas fa-check" />

                </form>

            </div>

        </Layout>
    )
}
