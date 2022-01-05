import Link from "next/link";
import { useRouter } from "next/router";

export default function Header({ isUserAdmin }) {

    // Définition de l'objet router
    const router = useRouter()

    return (
        <header className="main-header">

            {/* Navigation */}
            <nav className="main-header_navigation">
                <ul>
                    <li className={router.asPath === "/" ? "active" : ""}>
                        <Link href="/">
                            <a>Aujourd'hui</a>
                        </Link>
                    </li>
                    <li className={router.asPath === "/calendar" ? "active" : ""}>
                        <Link href="/">
                            <a>Calendrier</a>
                        </Link>
                    </li>
                    <li className={router.asPath === "/projects" ? "active" : ""}>
                        <Link href="/">
                            <a>Projets</a>
                        </Link>
                    </li>
                    <li className={router.asPath === "/clients" ? "active" : ""}>
                        <Link href="/">
                            <a>Clients</a>
                        </Link>
                    </li>
                    <li className={router.asPath === "/prospects" ? "active" : ""}>
                        <Link href="/">
                            <a>Prospects</a>
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Navigation admin -> ne se construit que si on est un admin */}
            {
                isUserAdmin === true ?
                <nav className="main-header_admin">
                    <ul>
                        <li>
                            <Link href="/">
                                <a>Journal</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Sauvegardes</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Réglages</a>
                            </Link>
                        </li>
                    </ul>
                </nav> : null
            }

        </header>
    )
}
