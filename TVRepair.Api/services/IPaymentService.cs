using TVRepair.Api.model;

namespace TVRepair.Api.services
{
    public interface IPaymentService
    {
        Task<Quotation?> GetPaymentSummaryAsync(
            Guid repairOrderId,
            string customerId);

        Task<string?> CreateCheckoutSessionAsync(
            Guid repairOrderId,
            string customerId);

        Task<PaymentConfirmationResult> ConfirmPaymentAsync(
            string sessionId);
    }
}

