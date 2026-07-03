import { createContext, useContext, useEffect, useState } from "react";
import http from "../Api";
import { useNavigate, useLocation } from "react-router";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [role, setRole] = useState("")
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {

        let token = localStorage.getItem("token")

        const validateToken = async () => {

            try {

                const res = await http.get("/api/v1/auth/get-me")

                if (res.data.status !== "success") {
                    localStorage.removeItem("token")
                    setIsAuth(false)
                    setRole("")
                    setUser(null)
                    if (location.pathname !== "/login" && location.pathname !== "/register") {
                        navigate("/login")
                    }
                }

                else {
                    setUser(res.data.data)
                    setIsAuth(true)
                    setRole(res.data.data.role)
                    if (location.pathname === "/login" || location.pathname === "/register") {
                        navigate("/")
                    }
                }

            } catch (error) {
                localStorage.removeItem("token")
                setIsAuth(false)
                setRole("")
                setUser(null)
                if (location.pathname !== "/login" && location.pathname !== "/register") {
                    navigate("/login")
                }

            } finally {
                setLoading(false)
            }
        }

        if (token) {
            validateToken()
        } else {
            setLoading(false)
            if (location.pathname !== "/login" && location.pathname !== "/register") {
                navigate("/login")
            }
        }


    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth, role, setRole, loading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}   