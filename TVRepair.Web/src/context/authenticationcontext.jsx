import { createContext,useContext,useState,useEffect } from "react";


const AuthContext = createContext(null)


export function useUserAuth() {
    return useContext(AuthContext);
}

export default function AuthenticationContext ( {children})
{
    const [user,setUser] = useState(null);
    const [isLogout, setLogoutMessage] = useState("");

    async function Logout()
    {
        const response = await fetch('http://localhost:5070/api/Authentication/logout',
            {
                method : "POST",
                credentials : "include"
            }
        )

        if(response.ok) {
        setUser(null);
        setLogoutMessage("Success Logout!");
        } 
        else alert("Logout failed")
    }


    //get current user when restart page
    useEffect(() => {
    async function restoreUser() {
        const response = await fetch(
        "http://localhost:5070/api/Authentication/GetCurrentUser",
        {
            credentials: "include"
        }
        );

        if (response.ok) {
        const data = await response.json();
        setUser(data);
        }
    }

    restoreUser();
    }, []);

    return (
        <AuthContext.Provider value={{
        user,
        setUser, 
        Logout,
        isLogout
        }}>
            
        {children}
        </AuthContext.Provider>
    )

}