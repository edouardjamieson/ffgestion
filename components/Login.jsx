import { useRouter } from "next/router";
import { useState } from "react";
import { getAuth, setAuth } from "../functions/database/users";
import Cta from "./Cta";
import Error from "./Error";
import Layout from "./Layout";

export default function Login() {

    const router = useRouter()

    const [loginUsername, setLoginUsername] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [validating, setValidating] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = () => {

        setValidating(true)

        if(!loginUsername.trim() || !loginPassword.trim()) {
            setValidating(false)
            return setError("Vous devez entrer un nom d'utilisateur & un mot de passe.")
        }

        setAuth(loginUsername, loginPassword)
        .then(result => {
            if(result === false) {
                setValidating(false)
                return setError("Nom d'utilisateur ou mot de passe invalide.")
            }

            router.reload()
        })

    }

    return (
        <Layout
            isValidating={validating}
        >
            <div className="login-container">
                <form id="login-form">

                    <h4>Se connecter</h4>
                    <input type="text" placeholder="nom d'utilisateur" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
                    <input type="password" placeholder="mot de passe" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                    <Cta type="button" text="Connexion" icon="fas fa-check" onClick={() => handleLogin()} />

                </form>
            </div>

            {
                error ? <Error text={error} onDismiss={() => setError("")} /> : null
            }
        </Layout>
    )
}
