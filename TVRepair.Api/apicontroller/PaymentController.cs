using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVRepair.Api.data;
using TVRepair.Api.services;

namespace TVRepair.Api.apicontroller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly string _frontendUrl;

        public PaymentController(
            IPaymentService paymentService,
            IConfiguration configuration)
        {
            _paymentService = paymentService;
            _frontendUrl = configuration["ApplicationUrls:Frontend"]
                ?? throw new InvalidOperationException(
                    "Frontend URL is missing.");
        }

        [Authorize]
        [HttpPost("GetPaymentSummary")]
        public async Task<ActionResult> GetPaymentSummary(
            [FromBody] GetPaymentSummaryRequest request)
        {
            var customerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (customerId == null)
            {
                return Unauthorized();
            }

            var paymentSummary = await _paymentService
                .GetPaymentSummaryAsync(
                    request.RepairOrderId,
                    customerId);

            if (paymentSummary == null)
            {
                return NotFound("Quotation not found.");
            }

            return Ok(paymentSummary);
        }

        [Authorize]
        [HttpPost("CreateCheckoutSession")]
        public async Task<ActionResult> CreateCheckoutSession(
            [FromBody] GetPaymentSummaryRequest request)
        {
            var customerId =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (customerId == null)
            {
                return Unauthorized();
            }

            var checkoutUrl = await _paymentService
                .CreateCheckoutSessionAsync(
                    request.RepairOrderId,
                    customerId);

            if (checkoutUrl == null)
            {
                return NotFound("Quotation not found.");
            }

            return Ok(new
            {
                url = checkoutUrl
            });
        }

        [HttpGet("PaymentSuccess")]
        public async Task<IActionResult> PaymentSuccess(
            [FromQuery(Name = "session_id")] string sessionId)
        {
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                return Redirect(
                    $"{_frontendUrl}/check-status?payment=invalid");
            }

            var result =
                await _paymentService.ConfirmPaymentAsync(sessionId);

            return result.Status switch
            {
                PaymentConfirmationStatus.Paid => Redirect(
                    $"{_frontendUrl}/check-status?payment=success&orderId={result.RepairOrderId}"),

                PaymentConfirmationStatus.NotPaid => Redirect(
                    $"{_frontendUrl}/check-status?payment=failed"),

                PaymentConfirmationStatus.OrderNotFound => Redirect(
                    $"{_frontendUrl}/check-status?payment=order-not-found"),

                _ => Redirect(
                    $"{_frontendUrl}/check-status?payment=invalid")
            };
        }
    }
}
