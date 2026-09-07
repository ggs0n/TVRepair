import { useUserAuth } from "../context/authenticationcontext";
import { useState,useEffect } from "react";
import Quotation from "./Quotation";
import { apiUrl } from "../config/api";
export default function TechnicianPage () {

    const {user} = useUserAuth();
    const [orderlist, setOrderTechnician]  = useState([])
    const [statusupdate, setStatusUpdate] = useState()
    const [quotationorder, setQuotationorder] = useState(null)
    const [notifyCustomer, setNotifyCustomer] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    async function GetOrderTechnician()
    {
        const query = new URLSearchParams (
            {
            Area : user?.area,
            TechnicianId : user?.id
        });

        const response = await fetch(
            apiUrl(`/api/tvrepair/GetRepairOrderTechnician?${query}`),
            {
                credentials: "include"
            }
        );

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

        const result = await fetch(apiUrl(`/api/tvrepair/AcceptRepairOrderTechnician?${query}`),
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

    async function UpdateJob(event)
    {
        event.preventDefault();

        const form = new FormData(event.currentTarget)
        form.set("repairOrderId", selectedJob.id);

        const updatejob = await fetch(apiUrl("/api/tvrepair/UpdateJob"),{
            method : "POST",
            credentials : "include",
            body : form
        })

        if (updatejob.ok)
        {
            const updatedOrder = await updatejob.json();

            setOrderTechnician((currentOrders) =>
                currentOrders.map((order) =>
                order.id === updatedOrder.id
                    ? { ...order, ...updatedOrder }
                    : order
                )
            );

            setSelectedJob(null);
            alert("update success!")
        }

    }

    return (

    <div className="p-4 m-4 mx-auto w-full max-w-[1500px] mt-10">
        <div className="mb-6">
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
                                    <button className="bg-green-700 p-3 m-2 rounded-xl text-white" onClick={() => {
                                        setSelectedJob(order);
                                        setStatusUpdate(order.status);
                                        }
                                        }>Update Status</button>
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
        
        { selectedJob && (
        <div>
        <h1 className="text-3xl font-bold">Job Details</h1>
        <div className="grid grid-cols-2 gap-5">
                <div className="mb-4 border border-1 border-gray-300 p-4">
                <h1>Manage your assigned repair jobs and update progress</h1>
                
                 <div>
                    <h1>Customer Email : {selectedJob.id}</h1>
                 </div>
                 </div>

                 <form onSubmit={UpdateJob}>
                 <div className="border border-1 border-gray-300 p-4">
                    <div className="mb-4">
                    <h1>Update Status</h1>
                    <select className="border border-1 border-gray-300" name="status">
                        <option value="Completed" >Complete</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                    </div>
                    
                    <div className="mb-4">
                    <h1>Repair Notes</h1>
                    <input type="text" name="repairnotes" className="w-100 border border-1 border-gray-300"></input>
                    </div>

                    <div className="mb-4">
                        <h1>Upload Repair Proof</h1>
                        <input type="file"></input>
                    </div>

                    <div>
                    <h1>Notify Customer</h1>
                    <input
                    type="checkbox"
                    checked={notifyCustomer}
                    onChange={(event) => setNotifyCustomer(event.target.checked)}
                    className="h-4 w-4 accent-green-600"
                    />
                    </div>
                    <button className="bg-green-800 p-4 m-2 text-white rounded-xl">Update</button>
                </div>
                </form>
        </div>
        </div>
        )}

    </div>

    ) 
}
