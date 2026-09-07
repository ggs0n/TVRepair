import "./statustracker.css";

const steps = [
    {
        status: "OrderPlace",
        label: "Order Placed"
    },
    {
        status: "Accepted",
        label: "Technician Accepted"
    },
    {
        status: "Quotation",
        label: "Quotation & Payment"
    },
    {
        status: "InProgress",
        label: "In Progress"
    },
    {
        status: "Completed",
        label: "Completed"
    }
];

export default function StatusTracker({ currentStatus, orderId }) {
    const currentIndex = steps.findIndex(
        step => step.status === currentStatus
    );

    return (
        <div className="flex justify-center">
            <div className="flex mx-auto w-full max-w-[2000px] items-start rounded-xl border border-gray-200 p-10">
                {steps.map((step, index) => {
                    const isReached = index <= currentIndex;
                    const isCompletedLine = index < currentIndex;

                    return (
                        <div
                            key={step.status}
                            className="relative flex-1 text-center"
                        >
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-1/2 top-[22px] h-px w-full ${
                                        isCompletedLine
                                            ? "bg-green-600"
                                            : "bg-gray-300"
                                    }`}
                                />
                            )}

                            <div
                                className={`status-circle relative z-10 ${
                                    isReached ? "current" : ""
                                }`}
                            >
                                {isReached ? "✓" : ""}
                            </div>

                            <p className="text-sm font-medium">
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}