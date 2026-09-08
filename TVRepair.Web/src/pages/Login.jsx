import { Link, useInRouterContext, useNavigate } from "react-router"
import { useState, useEffect } from "react";
import { useUserAuth } from "../context/authenticationcontext";
import { useLocation } from "react-router";
import { apiUrl } from "../config/api";

export default function Login()

{
    const { user, setUser, isLogout } = useUserAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutmessage = location.state?.message;

    async function LoginUser(event)
    {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);

        if (formData.get("password") !== formData.get("reenterpass"))
        {
            alert("Password not match")
            return;
        }

        const response = await fetch
        (apiUrl('/api/Authentication/loginuser'),
        {
            method : "POST",
            credentials: "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
              email : formData.get("email"),
              password : formData.get("password")
            })
        });

        if(response.ok)
        {
            const responsedata = await response.json();
            setUser(responsedata);
            alert("login success");

            if (responsedata.customertype == 'customer')
            navigate("/");
            else if(responsedata.customertype == 'technician')
            navigate("/technicianpage")

        }
        else {
            alert("login failed")
        }

    }

    return (
    <div className="mx-auto w-full max-w-[1800px] max-h-[1500px] grid grid-cols-2 py-10 gap-5">
        <div className="mx-auto mt-20">
        <img src="../src/assets/tvpicturemainpage.png" width={500} height={500}></img>
        </div>


        <div className="border border-gray-300 p-4 rounded-xl mr-6 shadow-xl ">
            <form onSubmit={LoginUser}>
            
            <div className="text-center mb-5">
            {logoutmessage && (
            <div>
                <h1>{logoutmessage}</h1>
            </div>
            )}
        
            <h1 className="mb-4">RepairLah!</h1>
            <h1 className="text-xl font-bold">Welcome Back!</h1>
            <h1>Login in to your account</h1>
            </div>

            <div className="mb-4">
            <label className="font-bold">Email Address</label>
            <input type="text" name="email" className="w-full border border-1 border-gray-300 rounded p-2"></input>
            </div>
            
            <div className="mb-4">
            <label className="font-bold">Customer Type</label><br/>
            <label><input type="radio" value="customer" name="customertype"></input> Customer</label>
            <label><input type="radio" value="technician" name="customertype"></input> Technician</label>
            </div>

            <label className="font-bold">Password </label><br/>
            <input type="password" name="password" className="w-full border border-1 border-gray-300 rounded p-2 mb-4"></input>
            <br></br>
            <label className="font-bold">Re-enter Password :</label>
            <input type="password" name="reenterpass" className="w-full border border-1 border-gray-300 rounded p-2 mb-4"></input><br/>

            <div className="flex container align-items-center gap-2 col-5">
            <button className="w-full bg-green-700 rounded-xl text-white font-bold p-2" type="submit">Login</button><br/>
            </div>
            
            </form>
        </div>
    </div>
    )
}
