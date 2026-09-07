import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../context/authenticationcontext";
import StatusTracker from "../components/statustracker";
import OrderPlaced from "./OrderPlaced";
import TechnicianAccepted from "./TechnicianAccepted";
import QuotationCustomer from "./QuotationCustomer";
import InProgress from "./InProgress";
import Complete from "./Complete";
import { useSearchParams } from "react-router";
import { apiUrl } from "../config/api";

export default function CheckStatus()
{
    const [searchParams] = useSearchParams();
    const [orders, setOrder] = useState([]);
    const [selectedorderid, setselectedOrderId] = useState(
    searchParams.get("orderId") ?? ""
);
    const {user} = useUserAuth();

    const statusmessage = {
        OrderPlace : "Your order has been placed."
    }

    const selectedorder = orders.find(order => order.id === selectedorderid) ?? orders[0] ?? null;

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
        <div className="py-2 px-10 max-w-500 mx-auto mt-20">
         <div className="flex items-center justify-between mb-10">
            <div>
            <h1 className="text-3xl font-bold">Track Your Repair</h1>
            <h2>Stay updated with the latest status of your repair</h2>
            </div>
            

            <div className="flex items-center">
            <p>Order Id = </p>
            <select className="mb-2 m-2 p-2" onChange={event => setselectedOrderId(event.target.value)}>
                {orders.map((order)=> (
                <option value={order.id}>{order.id}</option>
                ))}
            </select>
            </div>
        </div>

                        
            <div className="justify-content-center align-content-centent mb-2">
                { selectedorder && (
                <StatusTracker orderId={selectedorder.id} currentStatus={selectedorder.status}></StatusTracker>
                )
                }
            </div>

            { selectedorder?.status == "OrderPlace" && (
            <OrderPlaced orders={selectedorder}></OrderPlaced>
            )}
            
            { selectedorder?.status == "Accepted" && (
            <TechnicianAccepted orders={selectedorder}></TechnicianAccepted>
            )}

            { selectedorder?.status == "Quotation" && (
            <QuotationCustomer orders={selectedorder}></QuotationCustomer>
            )}

            { selectedorder?.status == "InProgress" && (
            <InProgress orders={selectedorder}></InProgress>
            )}

            { selectedorder?.status == "Completed" && (
            <Complete orders={selectedorder}></Complete>
            )}



        </div>
    )
}
