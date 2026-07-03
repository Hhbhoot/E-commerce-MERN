import { Outlet } from "react-router"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
export const Layout = () => {

    return (
        <>
            <Header />
            <div className="w-full h-full flex items-start justify-start ">
                <Sidebar />
                <Outlet />
            </div>
            <Footer />
        </>
    )

}