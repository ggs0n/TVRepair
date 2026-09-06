import { Modal} from 'bootstrap'
import "./orderrepair.css";
import { useQuery } from '@tanstack/react-query';
import { useUserAuth } from "../context/authenticationcontext";
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MonitorCog} from 'lucide-react'

export default function OrderRepair()
{
    const [brand, setBrand] = useState("Samsung");
    const [area, setArea] = useState("Kuala Lumpur");
    const [issuedescription, setIssueDesc] = useState();
    const { user } = useUserAuth();
    const [photo, setPhoto] = useState();
    const navigate = useNavigate();

    async function SaveData(event)
    {
        event.preventDefault()

        //assing value
        const formData = new FormData();
        formData.set("UserName", user.email);
        formData.set("Brand", brand);
        formData.set("Area", area);
        formData.set("IssueDescription",issuedescription);
        formData.set("CustomerId",user.id);
        formData.set("Photo",photo);

        const response = await fetch(
            'http://localhost:5070/api/TVRepair/AddRepairOrder',
            {
                method : 'POST',
                credentials : "include",
                body : formData
            }
        )

        if (response.ok) {
        const modalElement = document.getElementById('successModal')
        Modal.getOrCreateInstance(modalElement).show()
        navigate("/check-status")

        } else {
        const error = await response.text()
        console.error(error)
        }
    }
    
    return (
    <div className="">  
      <div className="container-fluid row justify-content-end mr-10 ml-10">

        <div className="grid grid-cols-2">
            <div className="p-6 left-side-tv bg-gradient-to-br from-white via-green-50/40 to-white">
            <p className="bg-green-200 rounded-full inline-flex text-sm font-semibold py-2 mb-3 text-green-700">Fast Easy Reliable</p>
            <h1 className="text-3xl font-bold">TV Broken?</h1>
            <h1 className='text-3xl font-bold mb-3'>We Repair, <span className="text-green-700">You Relax</span></h1>

            <div className="text-base space-y-3 text-sm">
            <p>Take photo and send to us</p>
            <p>Assign to technician under 5 minute</p>
            <p>technician will pickup your tv at your home</p>
            </div>

            <div className="flex justify-content-end">
                <img src="../src/assets/tvpicturemainpage.png" width={600} height={400}></img>
            </div>
            </div>        

            <div className="border border-1 rounded-xl border-gray-300 p-6 shadow-lg right-side-orderform">
            <form onSubmit={SaveData}> 

                <div className='flex mb-4'>
                    <MonitorCog className='m-4'></MonitorCog>
                    <div>
                    <p><b>What's wrong with your TV?</b></p>
                    <p>Provide a few details so we can help you faster</p>
                    </div>
                </div>

                <div className='mb-4'>
                <p className="font-bold">TV Brand?</p>
                {/* <input className="form-control" type="text" value={brand} onChange={(event)=>setBrand(event.target.value)}></input> */}
                <select className="w-full rounded-lg border border-gray-200 p-3" value={brand} onChange={(event)=> setBrand(event.target.value)}>
                    <option value="Samsung">Samsung</option>
                    <option value="Sony">Sony</option>
                    <option value="Hitachi">Hitachi</option>
                </select>
                </div>

                <div className='mb-2'>
                <p>Issue Description</p>
                <input className="w-full rounded-lg border border-gray-200 p-3" type="text" value={issuedescription} onChange={(event)=> setIssueDesc(event.target.value)}></input>
                </div>
                
                <div className='mb-2'>
                <p>Area</p>
                {/* <input className="form-control" type="text" value={area} onChange={(event)=>setArea(event.target.value)}></input> */}
                <select className="w-full rounded-lg border border-gray-300 p-3" value={area} onChange={(event)=> setArea(event.target.value)}>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Johor">Johor</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Cyberjaya">Cyberjaya</option>
                </select>
                </div>

                <div className='mb-4'>
                <p>Add Photo</p>
                <input className="w-full rounded-lg border  border-gray-200 p-3" name='Photo' type='file' accept='image/*' onChange={(event)=> setPhoto(event.target.files[0])}></input>
                </div>

                <button className="bg-green-700 py-3 text-white p-2 w-full rounded rounded-2 cursor-pointer hover:bg-green-950" type='submit'>Submit Order</button>
            </form>
            </div>
        </div>

        <div className="grid grid-cols-4 p-4 m-4 justify-content-center flex">
                <div>
                    Secure & Safe
                </div>
                <div>
                    Live Updates
                </div>
                <div>
                    Transparent Pricing
                </div>
                <div>
                    Support
                </div>
        </div>
        <div className="modal fade" id="successModal" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-title">
                    Order submitted
                </div>
                <div className="modal-body">
                    Successfully submitted
                </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    )
}
