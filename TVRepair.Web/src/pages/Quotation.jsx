import { useEffect,useState } from "react";
import { useUserAuth } from "../context/authenticationcontext";
import { apiUrl } from "../config/api";


export default function Quotation({order})
{
    const { user, setUser, isLogout } = useUserAuth();

    async function SubmitQuotation(event)
    {
        event.preventDefault();
        const form = new FormData(event.currentTarget)

        const response = await fetch(apiUrl('/api/tvrepair/SubmitQuotation'), {
            method : "POST",
            headers : {
               "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                repairorderid : order.id,
                quotationdesc : form.get("issue") + form.get("description"),
                customerid : order.customerid,
                technicianid : order.technicianid,
                amount : form.get("price"),
            }) 
        })

        if(response.ok)
        {
            alert("Submit Quotation")
            order(null)
        }
    }

    return (
    <>
        {  user.customertype == "technician" && (
        <div className="m-2 p-4 px-6 ml-10 border border-1 border-gray-300 rounded-xl flex flex-col">
          <h1 className="text-xl font-bold">Create Repair Quotation</h1>
          <h3>Diagnosis Details</h3>
          <p>Order Id : {order.id}</p>

          <form onSubmit={SubmitQuotation} className="p-4">
          <p>Issue</p>
          <input className="w-full max-w-200 border-1 rounded-xl border-gray-300 mb-4" name="issue" type="text"></input>
          
          <p>Recommended Repair</p>
          <input className="w-full max-w-200 border-1 rounded-xl border-gray-300 mb-4" name="description" type="text"></input>
           <p>Price</p>
           <input className="form-control w-full max-w-200 border-1 rounded-xl border-gray-300" name="price" type="text"></input>

           <div className="mt-5 w-full text-white border-xl rounded-xl p-3 flex justify-end">
            <button className="bg-green-700 py-4 px-4 rounded-xl" type="submit">Submit Quotation to Customer</button>
           </div>
          </form>
        </div>
        )}


    </>
    )

}
