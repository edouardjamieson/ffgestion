import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { getProjects } from "../../functions/database/projects"

export default function Index() {

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

        return (
            <div className="projects-list">

                {
                    projects.map(project =>
                    <div className="projects-list_item" key={project.id} onClick={() => router.push(`/projects/${project.data.slug}`)}>
                        <div className="projects-list_item-image" style={{ backgroundImage: `url(${project.data.image})` }}></div>
                        <div className="projects-list_item-infos">
                            <span>{ project.data.name }</span>
                        </div>
                    </div>)
                }

            </div>
        )
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
