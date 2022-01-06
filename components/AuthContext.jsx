import { useEffect, useState } from "react"
import { getAuth } from "../functions/database/users"
import Login from "./Login"
import Loader from "./Loader"

export default function AuthContext({ children }) {

    const [authState, setAuthState] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        getAuth()
        .then(auth => {
            setAuthState(auth)
            setLoading(false)
        })

    }, [])

    return loading ? <Loader /> : authState === null ? <Login /> : children
}
