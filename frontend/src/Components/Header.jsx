import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'

const Header = () => {
    const navigate = useNavigate()
    return (
        <div className='w-full h-[10vh] bg-violet-400 shadow-lg shadow-violet-200 flex items-center justify-end px-4'>

            <Button type='primary' className='bg-red-500 text-white cursor-pointer mx-4'
                onClick={() => {
                    localStorage.removeItem("token")
                    navigate("/login")
                }}
            >Logout</Button>

        </div>
    )
}

export default Header