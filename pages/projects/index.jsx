import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { getProjects } from "../../functions/database/projects"

export default function index() {

    //Permet de get l'objet router
    const router = useRouter()

    // L'application est en chargement par défaut
    const [loading, setLoading] = useState(true)
    // Par défaut la liste de projet est vide
    const [projects, setProjects] = useState([])


    useEffect(() => {

        getProjects()
        .then(projects => setProjects(projects))
        .then(() => setLoading(false))

    }, [])

    // ====================================================================
    // Liste des projets
    // ====================================================================
    const ProjectsList = () => {
        if(projects.length < 1) {
            return <span>Aucun projet.</span>
        }
    }

    return (
        <Layout
            title="Projets"
            hasButton={true}
            buttonLabel="Créer un projet"
            onButtonClick={() => router.push('/projects/new')}
            isLoading={loading}
        >

            <ProjectsList />

        </Layout>
    )
}
