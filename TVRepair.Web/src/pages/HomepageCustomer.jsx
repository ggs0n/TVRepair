import { useEffect, useState } from "react";
import { useUserAuth } from "../context/authenticationcontext";

export default function HomePageCustomer()
{
    const { user, setUser, isLogout } = useUserAuth();
    const [orders, setOrder] = useState([]);

    async function LoadOrder()
        {
            if (user?.email==null)
            {
                return;
            }
    
            const query = new URLSearchParams(
                {
                    UserName : user.email
                }
            );
    
            const response = await fetch
            (apiUrl(`/api/TVRepair/GetRepairOrder?${query}`),
                {
                    credentials: "include"
                }
            );
    
            const result = await response.json();
    
            if(response.ok)
            {
            setOrder(result.data);
            }
        }
    
        useEffect(()=> {
            LoadOrder();
        }, [user?.email])

    return (
        <div className="mx-auto max-w-[1500px] p-5">
            <h1>This is homepage customer</h1>
            
            {orders.map((order) => (
            <table>
                <thead>
                    <th></th>
                    <th></th>
                    <th></th>
                </thead>

                <tbody>
                    <tr>{order.id}</tr>
                </tbody>
            </table>
            ))}

        </div>
    )
}