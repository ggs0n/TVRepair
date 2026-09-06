using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using TVRepair.Api.data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;


namespace TVRepair.Api.apicontroller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly TVRepairDBContext _context;
        private readonly IStripeClient _stripeclient;

        public PaymentController(TVRepairDBContext context, IStripeClient stripeClient)
        {
            _context = context;
            _stripeclient = stripeClient;
        }


        [Authorize]
        [HttpPost("GetPaymentSummary")]
        public async Task <ActionResult> GetPaymentSummary ([FromBody] GetPaymentSummaryRequest request)
        {
            if(request==null)
            return BadRequest();

            try
            {
                var getpaymentsummary = await _context.Quotation.Where(x=>x.RepairOrderId == request.RepairOrderId).FirstOrDefaultAsync();
                return Ok(getpaymentsummary);
            }

            catch(Exception ex)
            {
                return BadRequest(ex);
            }
        }



        [Authorize]
        [HttpPost("CreateCheckoutSession")]
        public async Task<ActionResult> CreateCheckoutSession(
            [FromBody] GetPaymentSummaryRequest request)
        {
            try
            {
            var customerId =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            var quotation = await _context.Quotation.FirstOrDefaultAsync(q => q.RepairOrderId == request.RepairOrderId);

            if (quotation == null)
                return NotFound("Quotation not found.");

            var options = new SessionCreateOptions
            {
                Mode = "payment",

                SuccessUrl = "http://localhost:5070/api/payment/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}",

                CancelUrl =
                    "http://localhost:5173/payment-summary?payment=cancelled",

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

                            // RM100 becomes 10000 sen
                            UnitAmount = (long)quotation.Amount * 100,

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

            var service = new SessionService(_stripeclient);
            var session = await service.CreateAsync(options);

            return Ok(new
            {
                url = session.Url
            });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("PaymentSuccess")]
        public async Task<IActionResult> PaymentSuccess([FromQuery(Name = "session_id")] string sessionId)
        {
            var service = new SessionService(_stripeclient);
            var session = await service.GetAsync(sessionId);

            if (session.PaymentStatus != "paid")
            {
                return Redirect(
                    "http://localhost:5173/check-status?payment=failed"
                );
            }

            if (!session.Metadata.TryGetValue("repairOrderId", out var idText) ||
                !Guid.TryParse(idText, out var repairOrderId))
            {
                return Redirect(
                    "http://localhost:5173/check-status?payment=invalid"
                );
            }

            var order = await _context.RepairOrder.FirstOrDefaultAsync(x => x.Id == repairOrderId);

            if (order == null)
            {
                return Redirect(
                    "http://localhost:5173/check-status?payment=order-not-found"
                );
            }

            if (session.PaymentStatus == "paid")
            {
                order.PaymentStatus = "Paid";
                order.PaymentDate = DateTime.Now;
                order.PaymentAmount = session.AmountTotal;
                order.Status = "InProgress";
                await _context.SaveChangesAsync();
            }

            return Redirect(
            $"http://localhost:5173/check-status?payment=success&orderId={repairOrderId}"
            );
        }


    }
}