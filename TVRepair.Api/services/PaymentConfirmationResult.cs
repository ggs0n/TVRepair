namespace TVRepair.Api.services
{
    public enum PaymentConfirmationStatus
    {
        Paid,
        NotPaid,
        InvalidMetadata,
        InvalidPaymentDetails,
        OrderNotFound
    }

    public sealed record PaymentConfirmationResult(
        PaymentConfirmationStatus Status,
        Guid? RepairOrderId = null);
}

