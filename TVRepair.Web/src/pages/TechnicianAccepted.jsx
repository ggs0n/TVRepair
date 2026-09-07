export default function TechnicianAccepted({orders})
{
    return (
    <div className="py-6 mx-auto w-full max-w-[2000px]  grid grid-cols-3 gap-6">
        <div className=" border border-gray-300 rounded-2xl px-5 p-4">
            <h1 className="text-2xl mb-4">Repair Item</h1>
            <h1>Brand / Model : {orders.brand}</h1>
            <h1>Type : LED</h1>
        </div>

        <div className=" border border-gray-300 rounded-2xl px-5 p-4">
            <h1 className="text-2xl mb-4">Technician Details</h1>
            <h3 className="text-0xl">Technician has accepted your repair</h3>
            <h3>Technician id : {orders.technicianId}</h3>
            <h3>Area : {orders.area}</h3>
            <h3>Visit Schedule : {orders.createdDate}</h3>
            <h3>Please ensure someone is availabe on visit schedule date</h3>
        </div>

        <div className="border border-gray-300 rounded-2xl px-5 p-4">
            <h1 className="text-2xl mb-4">Order Details</h1>
            <h1>Customer Name : </h1>
            <h1>Phone : </h1>
            <h1>Address :</h1>
            <h1>Order Date :</h1>
        </div>
    </div>
    )
}