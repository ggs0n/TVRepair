using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TVRepair.Api.data;
using TVRepair.Api.model;
using TVRepair.Api.services;

namespace TVRepair.Api.apicontroller
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TVRepairController : ControllerBase
    {
        private readonly IRepairOrderService _repairOrderService;

        public TVRepairController(IRepairOrderService repairOrderService)
        {
            _repairOrderService = repairOrderService;
        }

        [HttpPost("AddRepairOrder")]
        public async Task<ActionResult> AddRepairOrder(
            [FromForm] RepairOrder request)
        {
            await _repairOrderService.AddRepairOrderAsync(request);

            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpGet("GetRepairOrder")]
        public async Task<ActionResult<List<GetRepairOrderResponse>>>
            GetRepairOrder(string UserName)
        {
            if (string.IsNullOrWhiteSpace(UserName))
            {
                return BadRequest("User name is required.");
            }

            var repairOrders =
                await _repairOrderService.GetRepairOrdersAsync(UserName);

            return Ok(repairOrders);
        }

        [HttpGet("GetRepairOrderTechnician")]
        public async Task<ActionResult<List<RepairOrder>>>
            GetRepairOrderTechnician(string Area, string TechnicianID)
        {
            if (string.IsNullOrWhiteSpace(Area) ||
                string.IsNullOrWhiteSpace(TechnicianID))
            {
                return BadRequest(
                    "Area and technician ID are required.");
            }

            var repairOrders = await _repairOrderService
                .GetRepairOrdersForTechnicianAsync(Area, TechnicianID);

            return Ok(repairOrders);
        }

        [HttpPost("AcceptRepairOrderTechnician")]
        public async Task<ActionResult> AcceptRepairOrderTechnician(
            Guid Id,
            string TechnicianId)
        {
            if (Id == Guid.Empty)
            {
                return BadRequest("ID is required.");
            }

            if (string.IsNullOrWhiteSpace(TechnicianId))
            {
                return BadRequest("Technician ID is required.");
            }

            var repairOrder = await _repairOrderService
                .AcceptRepairOrderAsync(Id, TechnicianId);

            if (repairOrder == null)
            {
                return NotFound("Repair order was not found.");
            }

            return Ok(new
            {
                id = repairOrder.Id,
                technicianId = repairOrder.TechnicianId,
                status = repairOrder.Status
            });
        }

        [HttpPost("MatchRepairOrderTechnician")]
        public ActionResult MatchRepairOrderTechnician()
        {
            return Ok();
        }

        [HttpPost("UpdateJob")]
        public async Task<ActionResult> UpdateJob(
            [FromForm] UpdateJobRequest request)
        {
            if (request.RepairOrderId == Guid.Empty)
            {
                return BadRequest("Repair order ID is required.");
            }

            var repairOrder =
                await _repairOrderService.UpdateJobAsync(request);

            if (repairOrder == null)
            {
                return NotFound("Repair order was not found.");
            }

            return Ok(repairOrder);
        }

        [HttpPost("SubmitQuotation")]
        public async Task<ActionResult> SubmitQuotation(
            [FromBody] SubmitQuotationRequest request)
        {
            var submitted =
                await _repairOrderService.SubmitQuotationAsync(request);

            if (!submitted)
            {
                return BadRequest(
                    "The repair order was not found or already has a quotation.");
            }

            return Ok();
        }
    }
}
