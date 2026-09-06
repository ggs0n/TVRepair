import './statustracker.css'

const steps = [
    {
        status: "OrderPlace",
        label: "Order Place"
    },
    {
        status: "Accepted",
        label: "Technician Accepted"
    },
    {
        status: "Quotation",
        label: "Quotation & Diagnosis"
    },
    {
        status: "InProgress",
        label: "In Progress"
    },
    {
        status: "Completed",
        label: "Completed"
    }
]


export default function StatusTracker({
    currentStatus,orderId
})
{

    return (
        <div className="justify-center flex">
            <div className="flex items-start justify-center flex border rounded-xl border-gray-200 p-10 w-full">
                {steps.map((step,index)=>{

                    const isCurrent = step.status == currentStatus;

                    return (
                    <div key={step.status} className='relative flex-1 text-center'>
                        {index < steps.length - 1 && (
                        <div className="absolute left-1/2 top-[22px] h-px not-first:w-full bg-gray-300" />
                        )}
                        <div className={`status-circle relative z-10 ${ isCurrent ? "current" : ""}`} >
                            {isCurrent ? "✓" : ""}
                        </div>
                        {step.label}
                    </div>
                    )
                })}
            </div>

        </div>
    )

}