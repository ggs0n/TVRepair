import { useUserAuth } from "../context/authenticationcontext";
import { useState,useEffect } from "react";
import Quotation from "./Quotation";
export default function TechnicianPage () {

    const {user} = useUserAuth();
    const [orderlist, setOrderTechnician]  = useState([])
    const [statusupdate, setStatusUpdate] = useState()
    const [quotationorder, setQuotationorder] = useState(null)

    async function GetOrderTechnician()
    {
        const query = new URLSearchParams (
            {
            Area : user?.area,
            TechnicianId : user?.id
        });

        const response = await fetch(`http://localhost:5070/api/tvrepair/GetRepairOrderTechnician?${query}`)

        const data = await response.json()

        if(response.ok)
        {
           setOrderTechnician(data)
        }
        else alert("No order found")
    }

    useEffect(() => {
        GetOrderTechnician();
    }, []);


    async function AcceptJob(orderid)
    {
        const query = new URLSearchParams (
            {
                TechnicianId : user.id,
                Id : orderid
            }
        ) 

        const result = await fetch(`http://localhost:5070/api/tvrepair/AcceptRepairOrderTechnician?${query}`,
            {
                method : "POST"
            }
        )

        const data = await result.json()

        if(result.ok)
        {
            alert("Updated")
            setOrderTechnician(previousOrders =>
            previousOrders.map(order =>
                order.id === data.id
                    ? { ...order, ...data }
                    : order
            )
            );
        }
        else alert("error")
        
    }

    return (

    <div className="p-4 m-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Technician Job Tracker</h1>
                <h1>Manage your assigned repair jobs and update progress</h1>
            </div>


            <div className="grid grid-cols-3 gap-5 mb-4">
                <div className="bg-red-200">
                     <h1>Assigned jobs</h1>
                </div>

                <div className="bg-yellow-200">
                    <h1>In Progress</h1>
                </div>

                <div className="bg-green-300">
                    <h1>Completed</h1>
                </div>

            </div>

            <div className="flex border border-2 overflow-x-auto rounded-lg">
                    <table className="min-w-full text-left m-2">
                        <thead className="bg-gray-400">
                            <th>Brand</th>
                            <th>Area</th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Order Id</th>
                            <th>Action</th>
                        </thead>
                        {orderlist.map((order) => (
                        <tbody key={order.id}>
                            <tr>
                                <td>{order?.brand}</td>
                                <td>{order?.area}</td>
                                <td>{order?.userName}</td>
                                <td>{order?.status}</td>
                                <td>{order?.id}</td>
                                { order.status == "OrderPlace" && (
                                <td>
                                    <button className="bg-green-700 p-3 m-2 rounded-xl text-white" onClick={() => AcceptJob(order.id)}>Accept Job</button>
                                </td>
                                )}

                                { order.status == "Accepted" && (
                                <td>
                                    <button className="bg-green-700 p-3 m-2 rounded-xl text-white" onClick={() => setQuotationorder(order)}>Add Quotation</button>
                                </td>
                                )} 

                                { order.status == "InProgress" && (
                                <td>
                                    <button className="bg-green-700 p-3 m-2 rounded-xl text-white" onClick={() => setQuotationorder(order)}>Update Status</button>
                                </td>
                                )} 
                            </tr>
                        </tbody>
                        ))}
                    </table>

                    { quotationorder && (
                    <Quotation order={quotationorder}></Quotation>
                    )
                    }
            </div>
    </div>

    ) 
}
