import { useEffect,useState } from "react";
import { useUserAuth } from "../context/authenticationcontext";


export default function Quotation({order})
{
    const { user, setUser, isLogout } = useUserAuth();

    async function SubmitQuotation(event)
    {
        event.preventDefault();
        const form = new FormData(event.currentTarget)

        const response = await fetch('http://localhost:5070/api/tvrepair/SubmitQuotation', {
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
        <div className="m-2 p-2">
          <h1>Create Repair Quotation</h1>
          <h3>Diagnosis Details</h3>
          <p>Order Id : {order.id}</p>

          <form onSubmit={SubmitQuotation}>
          <p>Issue</p>
          <input className="form-control" name="issue" type="text"></input>
          <p>Recommended Repair</p>
          <input className="form-control" name="description" type="text"></input>
           <p>Price</p>
           <input className="form-control" name="price" type="text"></input>
           <button type="submit">Submit Quotation to Customer</button>
          </form>
        </div>
        )}


    </>
    )

}