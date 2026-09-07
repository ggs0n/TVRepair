using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using TVRepair.Api.data;
using TVRepair.Api.model;

namespace TVRepair.Api.services
{
    public class PaymentService : IPaymentService
    {
        private readonly TVRepairDBContext _context;
        private readonly IStripeClient _stripeClient;
        private readonly string _frontendUrl;
        private readonly string _apiUrl;

        public PaymentService(
            TVRepairDBContext context,
            IStripeClient stripeClient,
            IConfiguration configuration)
        {
            _context = context;
            _stripeClient = stripeClient;
            _frontendUrl = configuration["ApplicationUrls:Frontend"]
                ?? throw new InvalidOperationException(
                    "Frontend URL is missing.");
            _apiUrl = configuration["ApplicationUrls:Api"]
                ?? throw new InvalidOperationException(
                    "API URL is missing.");
        }

        public async Task<Quotation?> GetPaymentSummaryAsync(
            Guid repairOrderId,
            string customerId)
        {
            return await (
                from quotation in _context.Quotation
                join repairOrder in _context.RepairOrder
                    on quotation.RepairOrderId equals repairOrder.Id
                where quotation.RepairOrderId == repairOrderId &&
                      repairOrder.CustomerId == customerId
                select quotation)
                .FirstOrDefaultAsync();
        }

        public async Task<string?> CreateCheckoutSessionAsync(
            Guid repairOrderId,
            string customerId)
        {
            var quotation = await GetPaymentSummaryAsync(
                repairOrderId,
                customerId);

            if (quotation == null)
            {
                return null;
            }

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                SuccessUrl =
                    $"{_apiUrl}/api/payment/PaymentSuccess?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl =
                    $"{_frontendUrl}/payment-summary?payment=cancelled",
                ClientReferenceId = quotation.RepairOrderId.ToString(),
                Metadata = new Dictionary<string, string>
                {
                    ["repairOrderId"] = quotation.RepairOrderId.ToString(),
                    ["quotationId"] = quotation.QuotationId.ToString()
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new()
                    {
                        Quantity = 1,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "myr",
                            UnitAmount = (long)Math.Round(
                                quotation.Amount * 100m),
                            ProductData =
                                new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = "TV Repair Service",
                                    Description = quotation.QuotationDesc
                                }
                        }
                    }
                }
            };

            var sessionService = new SessionService(_stripeClient);
            var session = await sessionService.CreateAsync(options);

            return session.Url;
        }

        public async Task<PaymentConfirmationResult> ConfirmPaymentAsync(
            string sessionId)
        {
            var sessionService = new SessionService(_stripeClient);
            var session = await sessionService.GetAsync(sessionId);

            if (session.PaymentStatus != "paid")
            {
                return new PaymentConfirmationResult(
                    PaymentConfirmationStatus.NotPaid);
            }

            if (session.Metadata == null ||
                !session.Metadata.TryGetValue(
                    "repairOrderId",
                    out var repairOrderIdText) ||
                !Guid.TryParse(repairOrderIdText, out var repairOrderId))
            {
                return new PaymentConfirmationResult(
                    PaymentConfirmationStatus.InvalidMetadata);
            }

            var repairOrder = await _context.RepairOrder
                .FirstOrDefaultAsync(order => order.Id == repairOrderId);

            if (repairOrder == null)
            {
                return new PaymentConfirmationResult(
                    PaymentConfirmationStatus.OrderNotFound,
                    repairOrderId);
            }

            var quotation = await _context.Quotation
                .FirstOrDefaultAsync(
                    item => item.RepairOrderId == repairOrderId);

            var expectedAmount = quotation == null
                ? (long?)null
                : (long)Math.Round(quotation.Amount * 100m);

            if (expectedAmount == null ||
                session.AmountTotal != expectedAmount ||
                !string.Equals(
                    session.Currency,
                    "myr",
                    StringComparison.OrdinalIgnoreCase))
            {
                return new PaymentConfirmationResult(
                    PaymentConfirmationStatus.InvalidPaymentDetails,
                    repairOrderId);
            }

            if (repairOrder.PaymentStatus != "Paid")
            {
                repairOrder.PaymentStatus = "Paid";
                repairOrder.PaymentDate = DateTime.UtcNow;
                repairOrder.PaymentAmount = session.AmountTotal;
                repairOrder.Status = "InProgress";

                _context.RepairOrderStatusHistory.Add(
                    new RepairOrderStatusHistory
                    {
                        RepairOrderID = repairOrder.Id,
                        Status = repairOrder.Status,
                        UpdatedDate = DateTime.UtcNow
                    });

                await _context.SaveChangesAsync();
            }

            return new PaymentConfirmationResult(
                PaymentConfirmationStatus.Paid,
                repairOrderId);
        }
    }
}
