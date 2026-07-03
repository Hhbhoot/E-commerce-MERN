import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../Context/Auth'

const ProtectedRoutes = ({ roles }) => {

    const { isAuth, loading, role } = useAuth()
    console.log("isAuth:", isAuth, "loading:", loading, "role", role)



    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        )
    }

    if (!roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (!isAuth) {
        return <Navigate to={"/login"} replace />
    }

    return <Outlet />
}

export default ProtectedRoutes