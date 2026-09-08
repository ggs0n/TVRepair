export default function Complete({orders})
{
    return (
        <div className="mx-auto w-full max-w-[2000px] grid-cols-2 flex gap-5 w-full items-start">
            <div className="flex-4">
                <div className="mb-5 p-4 border border-1 border-gray-300">
                    <h1 className="font-bold">Device Information</h1>
                    <h1>Brand : {orders.brand}</h1>
                    <h1>Issue Description : {orders.issueDescription}</h1>
                </div>
                <div className="mb-5 p-4 border border-1 border-gray-300">
                    <h1 className="font-bold">Technician Information</h1>
                    <h1>Phone : </h1>
                    <h1>Service Area : {orders.area}</h1>
                </div>

            </div>

            <div className="flex-6">
            <div className="p-4 border border-1 border-gray-300">
                <div className="mb-6 bg-green-100 p-4">
                    <h1 className="font-bold">Your repair is completed</h1>
                    <h1>Your TV has been repaired successfully and ready for collection or delivery</h1>
                </div>

                <div className="mb-6">
                    <h1 className="font-bold">Repair Details</h1>
                    <h1>Payment Date : {orders.createdDate}</h1>
                    <h1>Estimated Completion : Completed</h1>
                    <h1>Notes : </h1>
                </div>

                <div className="bg-blue-300">
                    <h1>Sit Tight</h1>
                    <h1>You'll receive a notification once your TV is ready for collection or delivery. Please contact technician for more info</h1>
                </div>
            </div>
            </div>
        </div>
    )
}