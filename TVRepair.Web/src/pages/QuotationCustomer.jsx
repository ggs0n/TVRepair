import { useEffect,useState } from "react";
import { useUserAuth } from "../context/authenticationcontext";

export default function QuotationCustomer ({orders})
{

        const [paymentsummary ,setPaymentSummary] = useState("")


        async function Pay()
        {
            const paymentsummary = await fetch('http://localhost:5070/api/payment/CreateCheckoutSession', {
                method : "POST",
                headers : {
                  "Content-Type" : "application/json"
                },
                credentials : "include",
                body : JSON.stringify ({
                    RepairOrderId : orders.id
                })
            })

            if (paymentsummary.ok)
            {
              const response = await paymentsummary.json();
              setPaymentSummary(response)
              window.location.href = response.url;
            }
        }

        async function Decline()
        {
            const paymentsummary = await fetch('http://localhost:5070/api/payment/DeclinePayment', {
                method : "POST",
                type : {
                    type : "application/json"
                },
                headers : {
                  "Content-Type" : "application/json"
                },
                body : JSON.stringify ({
                    orders
                })
            })

            if (paymentsummary.ok)
            {
              const response = await paymentsummary.json();
              window.location.href = response.url;
            }
        }

        return (
            <div className="justify-center grid-cols-2 flex gap-5 p-10 rounded-xl bg-gradient from-50% bg-green-800 to bg-black">
                <div className="p-5 border-1 bg-white">
                    <div className="mb-6 shadow-lg p-4">
                    <h1 className="text-2xl font-bold">Device Information</h1>
                    <h1>Brand : {orders.brand}</h1>
                    <h1>Issue Description : {orders.issueDescription}</h1>
                    <h1>Accessories :</h1>
                    </div>

                    <div className="mb-6 shadow-lg p-4">
                    <h1 className="text-2xl font-bold">Technician Information</h1>
                    <h1>Name : {orders.technicianId}</h1>
                    <h1>Rating : 5/5</h1>
                    <h1>Date Pickup : {orders.createdDate}</h1>
                    <h1>Date Quotation : { orders.quotationDate}</h1>
                    <h1>Service Area : {orders.area}</h1>
                    </div>
                </div>

                <div className="border border-1 p-5 bg-white">
                    <div>
                    <div className="py-5 align-middle">
                    <h1 className="text-3xl">Quotation Summary</h1>
                    <p className="mb-4">Diagnostic Result : {orders.quotationDesc}</p>

                    <table className="border border-1 m-0 p-4">
                        <thead className="border border-2 bg-gray-400">
                            <tr>
                                <th className="px-4 py-3">Item / Part</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-right">Unit Price (RM)</th>
                                <th className="px-4 py-3 text-right">Total (RM)</th>
                            </tr>
                        </thead>

                        <tbody>
                                <tr key={orders.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{orders.brand}</td>
                                <td className="px-4 py-3 text-gray-600">{orders.quotationDesc}</td>
                                <td className="px-4 py-3 text-center">{orders.quotationAmount}</td>
                                <td className="px-4 py-3 text-right">{orders.quotationAmount.toFixed(2)}
                                </td>
                                </tr>
                        </tbody>
                        <p>Total : {orders.quotationAmount}</p>
                    </table>
                    
                    </div>
                    <div className="flex gap-4">
                    <button className="bg-green-700 cursor-pointer w-100 text-white p-2 items-center align-middle" onClick={Pay}>Accept & Pay</button>
                    <button className="bg-red-700 cursor-pointer w-100 text-white p-2 items-center align-middle" onClick={Decline}>Decline</button>
                    </div>
                    </div>
                </div>

                
            </div>
        )
}