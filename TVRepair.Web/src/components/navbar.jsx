
import OrderRepair from "./orderrepair"
import CheckStatus from "../pages/CheckStatus"
import './navbar.css'
import { Link, useNavigate } from "react-router"
import { useUserAuth } from "../context/authenticationcontext"
import { useState } from "react"

export default function Navbar()
{
    const { user, setUser, Logout} = useUserAuth();
    const navigate = useNavigate();

    function LogoutFlow()
    {
        Logout();

        navigate("/login", {
            state : { message : "success logout"}
        })
    }

    return (
        <>
            <div className="flex justify-between p-2 m-2">
                <div className="flex m-2">
                <img src='../src/assets/logomain.png' width={50} className="m-1"></img>
                <h1 className="mb-0 title-name">Repair<span className="text-success">Lah!</span></h1>
                <span><b>2026</b></span>
                </div>
                
                <div className="gap-2 p-4 flex items-end">
                    <Link to="/" className="bg-emerald-700 px-4 py-2 rounded-xl text-white border border-2">Home</Link>

                    {user?.customertype == "customer" && (
                    <Link to="/check-status" className="bg-emerald-700 px-4 py-2 rounded-xl text-white border border-2">Check Status</Link>
                    )}

                    {user?.customertype == "technician" && (
                    <Link to="/technicianpage" className="bg-emerald-700 px-4 py-2 rounded-xl text-white border border-2">Check Job</Link>
                    )}

                    { !user && (
                    <>
                    <Link to="/login" className="bg-emerald-700 px-4 py-2 rounded-xl text-white border border-2">Login</Link>
                    <Link to="/register" className="bg-emerald-700 px-4 py-2 rounded-xl text-white border border-2">Register</Link>
                    </>
                    ) }

                    { user && (
                        <div className="flex">
                        <button className="bg-emerald-700 px-4 py-2 rounded-xl cursor-pointer text-white border border-2" onClick={LogoutFlow}>Logout</button>
                        <div>
                        <p className="m-2">Hello! <b>{user?.email}, {user?.name}</b></p>
                        </div>
                        </div>                   
                    )} 
                </div>
            </div>
        </>

    )
}
